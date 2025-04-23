# integration test for booking duplicate prevention
# Creates a booking and checks if the second booking is skipped
import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from studio.models import CustomUser, YogaClass, YogaClassOccurrence, Booking, TeacherProfile
from datetime import date, time, timedelta

@pytest.mark.django_db
def test_booking_duplicate_prevention():
    client = APIClient()
    user = CustomUser.objects.create_user(username='client1', password='pass', role='client')
    client.force_authenticate(user=user)

    teacher_user = CustomUser.objects.create_user(username='teacher1', password='pass', role='teacher')
    teacher = TeacherProfile.objects.create(user=teacher_user, bio='bio', specialties='yoga')
    yoga_class = YogaClass.objects.create(
        title="Morning Flow", description="Test", day_of_week="monday",
        time=time(8, 0), start_date=date.today(), duration=timedelta(minutes=60),
        location="Peterborough", teacher=teacher
    )
    occurrence = YogaClassOccurrence.objects.create(
        yoga_class=yoga_class,
        date=date.today() + timedelta(days=1),
        capacity=10
    )

    booking_url = reverse('booking-list')
    basket_data = {
        "basket": [
            {"selectedOccurrence": {"id": occurrence.id}}
        ]
    }

    # First booking should be created
    response1 = client.post(booking_url, basket_data, format='json')
    assert response1.status_code == 201
    assert response1.data['created_bookings'] != []

    # Second booking attempt should be skipped as duplicate
    response2 = client.post(booking_url, basket_data, format='json')
    assert response2.status_code == 201
    assert response2.data['skipped_duplicates'] == [occurrence.id]
