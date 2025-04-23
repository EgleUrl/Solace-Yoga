# Views for the Solace Yoga Studio API
# This file contains the main logic for handling requests and responses,
# including user authentication, class management, booking handling, and announcements.
# email templataes are also defined here for sending booking confirmations and newsletters.

from rest_framework import generics
from rest_framework import viewsets, permissions
from rest_framework import filters
from .models import TeacherProfile, YogaClass, YogaClassOccurrence, Booking, Announcement
from .serializers import (
    UserSerializer, RegisterSerializer, TeacherProfileSerializer,
    YogaClassSerializer, YogaClassOccurrenceSerializer, BookingSerializer, AnnouncementSerializer
)
from .permissions import IsAdminUser, IsTeacherUser, IsBookingOwnerOrAdmin, IsAnnouncementOwnerOrAdmin
from django.core.mail import send_mail
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import requests as external_requests
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mass_mail
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from django.utils.timezone import now


User = get_user_model()
# Function to send booking confirmation emails to user and teacher
def send_booking_confirmation(booking):
        user = booking.user
        yoga_class = booking.yoga_class
        teacher = yoga_class.teacher.user

        # User email
        subject_user = "Your Solace Yoga Booking is Confirmed"
        message_user = f"""
Hi {user.first_name or user.username},

Thank you for booking with Solace Yoga! 🌿

📅 Class: {yoga_class.title}
👩‍🏫 Teacher: {teacher.username}
📍 Location: {yoga_class.location}
🕒 Time: {yoga_class.time}

Your booking has been confirmed. We look forward to seeing you!

Namaste 🙏,
Solace Yoga
"""

        send_mail(
            subject_user,
            message_user,
            'no-reply@solaceyoga.com',
            [user.email],
            fail_silently=True,
        )

        # Teacher email
        subject_teacher = "New Booking for Your Class!"
        message_teacher = f"""
Hi {teacher.first_name or teacher.username},

Good news! A new booking has been made for your class. 🎉

📅 Class: {yoga_class.title}
🧘 Student: {user.first_name or user.username}
📍 Location: {yoga_class.location}
🕒 Time: {yoga_class.time}


Namaste 🙏,
Solace Yoga
"""

        send_mail(
            subject_teacher,
            message_teacher,
            'no-reply@solaceyoga.com',
            [teacher.email],
            fail_silently=True,
        )
# Function to send newsletter emails to users
# This function is called when an announcement is created and published
def send_announcement_newsletter(announcement):
    subject = f"[Solace Yoga] {announcement.title}"
    message = announcement.content

    if announcement.yoga_class:
        users = User.objects.filter(
            bookings__yoga_class=announcement.yoga_class
        ).distinct()
    else:
        users = User.objects.filter(role__in=['client', 'teacher'])

    recipient_list = [u.email for u in users if u.email]

    datatuple = [(subject, message, 'no-reply@solaceyoga.com', [email]) for email in recipient_list]
    send_mass_mail(datatuple, fail_silently=True)

# Defines Google login view for authentication
# This view handles the Google OAuth2 login process and creates a user if they don't exist
# It also assigns a role based on the user's email address
# and returns JWT tokens for authenticated users.
class GoogleLoginView(APIView):
    def post(self, request):
        access_token = request.data.get('access_token')

        if access_token is None:
            return Response({'error': 'Access token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user_info_response = external_requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )

        if user_info_response.status_code != 200:
            return Response({'error': 'Failed to fetch user info from Google.'}, status=status.HTTP_400_BAD_REQUEST)

        user_info = user_info_response.json()

        email = user_info['email']
        username = email.split('@')[0]
        name = user_info.get('name', username)

        # Add logic to assign role based on trusted emails
        admin_emails = ['eglesman@gmail.com']  # admin email
        teacher_emails = ['teacheremail@gmail.com']  # optional for the specific teachers gmail accounts

        if email in admin_emails:
            role = 'admin'
        elif email in teacher_emails:
            role = 'teacher'
        else:
            role = 'client'

        user, created = User.objects.get_or_create(email=email, defaults={
            'username': username,
            'role': role,
        })

        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'username': user.username,
                'email': user.email,
                'role': user.role,
            }
        })


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]  # Admin only custom permission

class TeacherProfileViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherProfileSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), (IsAdminUser | IsTeacherUser)()] # Custom permission for teacher profile


class YogaClassViewSet(viewsets.ModelViewSet):
    queryset = YogaClass.objects.all()
    serializer_class = YogaClassSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['day_of_week', 'location', 'teacher__user__username']

    # Query returning all yoga classes for authenticated teachers
    # and all classes for unauthenticated users
    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated and user.role == 'teacher':
            return YogaClass.objects.filter(teacher__user=user)

        return YogaClass.objects.all()    
    
    
class YogaClassOccurrenceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = YogaClassOccurrence.objects.filter(
        is_canceled=False,
        date__gte=timezone.now().date()
    ).order_by('date')
    serializer_class = YogaClassOccurrenceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['yoga_class__id']

    # Filter by yoga class ID in the query params
    # This allows to filter occurrences by class ID in the URL, e.g. /api/occurrences/?class=1
    def get_queryset(self):
        queryset = super().get_queryset()
        yoga_class_id = self.request.query_params.get('class')
        if yoga_class_id:
            queryset = queryset.filter(yoga_class__id=yoga_class_id)
        return queryset
    
    # Django rest framework action to get the next two occurrences for a teacher
    # allows to define custom endpoints in the viewset
    # detail=False means this is a list action, not a detail action
    @action(detail=False, methods=['get'], url_path='my-next', permission_classes=[IsAuthenticated])
    def my_next(self, request):
        user = request.user
        if user.role != 'teacher':
            return Response([])

        # Get upcoming occurrences for this teacher
        upcoming = YogaClassOccurrence.objects.filter(
            yoga_class__teacher__user=user,
            date__gte=now().date(),
            is_canceled=False
        ).order_by('date')[:2]

        # Build response with booking counts
        data = []
        for occ in upcoming:
            booking_count = occ.bookings.count()  # uses related_name on Booking model
            item = {
                'id': occ.id,
                'date': occ.date,
                'time': occ.yoga_class.time,
                'class_title': occ.yoga_class.title,
                'location': occ.yoga_class.location,
                'booking_count': booking_count,
            }
            data.append(item)

        return Response(data)
    
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.none() 
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsBookingOwnerOrAdmin]
    
    # Filter bookings by user
    def get_queryset(self):
        user = self.request.user
        print("BookingViewSet | user:", user)
        print("Is authenticated:", user.is_authenticated)
        print("Role:", getattr(user, 'role', None))

        if user.is_authenticated and user.role == 'client':
            return Booking.objects.filter(user=user)
 
    # Creates a booking for the user
    # This method is called when a POST request is made to the viewset
    # It takes the basket from the request data, iterates through it,
    # and creates bookings for each occurrence in the basket
    # It also checks for duplicates and skips them
    def create(self, request, *args, **kwargs):
        basket = request.data.get('basket', [])
        user = request.user

        created_bookings = []
        skipped_duplicates = []

        for item in basket:
            occurrence_id = item.get('selectedOccurrence', {}).get('id')
            if not occurrence_id:
                continue

            try:
                occurrence = YogaClassOccurrence.objects.get(id=occurrence_id)

                #  Skip if this user already booked this occurrence
                if Booking.objects.filter(user=user, occurrence=occurrence).exists():
                    skipped_duplicates.append(occurrence_id)
                    continue

                booking = Booking.objects.create(
                    user=user,
                    yoga_class=occurrence.yoga_class,
                    occurrence=occurrence
                )

                occurrence.booked_count += 1
                occurrence.save()

                send_booking_confirmation(booking)
                created_bookings.append(booking.id)

            except YogaClassOccurrence.DoesNotExist:
                continue

        return Response({
            'created_bookings': created_bookings,
            'skipped_duplicates': skipped_duplicates
        }, status=status.HTTP_201_CREATED)    


class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAnnouncementOwnerOrAdmin()]
        return super().get_permissions()
   
    # Filter announcements by yoga class ID in the query params and order by created_at
    def get_queryset(self):
        return Announcement.objects.filter(published=True).order_by('-created_at')

    # Override the perform_create method to send a newsletter when an announcement is published
    # This method is called when a new announcement is created
    def perform_create(self, serializer):
        announcement = serializer.save(created_by=self.request.user)
        if announcement.published:
            send_announcement_newsletter(announcement)


