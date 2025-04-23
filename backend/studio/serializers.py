# Serializers for the Yoga Studio app
# These serializers handle the conversion of complex data types, such as Django models, into JSON format.
# and vice versa. They are used in the API views to validate and serialize data.
# This file contains serializers for the Yoga Studio app, including user registration, teacher profiles,
# yoga classes, bookings, and announcements.

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TeacherProfile, YogaClass, Booking, Announcement
from rest_framework import serializers
from .models import YogaClassOccurrence
from datetime import datetime, timedelta
import pytz
from django.utils.timezone import now
from studio.models import YogaClassOccurrence


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[('client', 'client'), ('teacher', 'teacher')], default='client')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],  
        )
        return user

class TeacherProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = TeacherProfile
        fields = ['id', 'username', 'email', 'bio', 'photo', 'specialties']


class YogaClassSerializer(serializers.ModelSerializer):
    teacher = TeacherProfileSerializer(read_only=True)

    class Meta:
        model = YogaClass
        fields = [
            'id',
            'title',
            'description',
            'day_of_week',
            'time',
            'start_date',
            'end_date',
            'duration',
            'location',
            'teacher',
            'capacity'
        ]

    def create(self, validated_data):
        # Auto-assign teacher if user is a teacher
        user = self.context['request'].user
        if user.role == 'teacher':
            teacher_profile = user.teacherprofile
            validated_data['teacher'] = teacher_profile
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Ensure teacher cannot change assigned teacher
        validated_data.pop('teacher', None)
        return super().update(instance, validated_data)
    
class YogaClassOccurrenceSerializer(serializers.ModelSerializer):
    class_title = serializers.CharField(source='yoga_class.title', read_only=True)
    teacher = serializers.CharField(source='yoga_class.teacher.user.username', read_only=True)

    class Meta:
        model = YogaClassOccurrence
        fields = [
            'id',
            'yoga_class',
            'class_title',
            'teacher',
            'date',
            'is_canceled',
            'capacity',
            'booked_count',
        ]

    
class BookingSerializer(serializers.ModelSerializer):
    yoga_class = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ['id', 'status', 'booking_date', 'yoga_class']

    def get_yoga_class(self, obj):
        yc = obj.yoga_class

        next_occ = YogaClassOccurrence.objects.filter(
            yoga_class=yc,
            date__gte=now().date(),
            is_canceled=False
        ).order_by('date').first()

        return {
            'title': yc.title,
            'location': yc.location,
            'teacher_name': yc.teacher.user.username,
            'next_occurrence': next_occ.date if next_occ else None,
        }


class AnnouncementSerializer(serializers.ModelSerializer):
    yoga_class_title = serializers.CharField(source='yoga_class.title', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Announcement
        fields = [
            'id',
            'title',
            'content',
            'created_at',
            'published',
            'yoga_class',
            'yoga_class_title',
            'created_by',
            'created_by_username',
        ]
        read_only_fields = ['created_by']




