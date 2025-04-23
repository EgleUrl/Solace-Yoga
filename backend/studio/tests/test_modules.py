# Unit tests for the YogaClass model checks if teacher user can create a yoga class
# and if the string representation of the class is correct.
import pytest
from studio.models import CustomUser, TeacherProfile, YogaClass
from datetime import time, date

@pytest.mark.django_db
def test_yoga_class_str():
    user = CustomUser.objects.create(username='teacher', role='teacher')
    teacher = TeacherProfile.objects.create(user=user, bio='bio', specialties='Vinyasa')

    yoga_class = YogaClass.objects.create(
        title="Evening Calm",
        description="Relax",
        day_of_week="tuesday",
        time=time(18, 30),
        start_date=date(2025, 4, 18),  
        end_date=date(2025, 5, 18),    
        duration="01:00:00",
        location="Peterborough",
        teacher=teacher,
        capacity=10
    )

    assert str(yoga_class) == f"Evening Calm with {user.username} on Tuesday at 18:30:00"

