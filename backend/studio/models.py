# Databse models for the yoga studio app
# users, classes, teachers, bookings, and announcements
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

DAY_CHOICES = [
    ('monday', 'Monday'),
    ('tuesday', 'Tuesday'),
    ('wednesday', 'Wednesday'),
    ('thursday', 'Thursday'),
    ('friday', 'Friday'),
    ('saturday', 'Saturday'),
    ('sunday', 'Sunday'),
]

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('client', 'Client'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')

    def is_admin(self):
        return self.role == 'admin'

    def is_teacher(self):
        return self.role == 'teacher'

    def is_client(self):
        return self.role == 'client'
    
class TeacherProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    bio = models.TextField()
    photo = models.ImageField(upload_to='teachers/', blank=True, null=True)
    specialties = models.CharField(max_length=255)

class YogaClass(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    day_of_week = models.CharField(max_length=10, choices=DAY_CHOICES)
    time = models.TimeField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)  # Ongoing if blank
    duration = models.DurationField()
    location = models.CharField(max_length=100)
    teacher = models.ForeignKey('TeacherProfile', on_delete=models.CASCADE, related_name='classes')
    capacity = models.PositiveIntegerField(default=10)

    def __str__(self):
        return f"{self.title} with {self.teacher.user.username} on {self.day_of_week.capitalize()} at {self.time}"
    


class YogaClassOccurrence(models.Model):
    yoga_class = models.ForeignKey(
        'YogaClass',
        on_delete=models.CASCADE,
        related_name='occurrences'
    )
    date = models.DateField()
    is_canceled = models.BooleanField(default=False)
    capacity = models.PositiveIntegerField(default=10)
    booked_count = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('yoga_class', 'date')
        ordering = ['date']

    def is_full(self):
        return self.booked_count >= self.capacity

    def is_past(self):
        return self.date < timezone.now().date()

    def __str__(self):
        status = "Canceled" if self.is_canceled else "Full" if self.is_full() else "Available"
        return f"{self.yoga_class.title} on {self.date} ({status})"


class Booking(models.Model):
    STATUS_CHOICES = (
        ('booked', 'Booked'),
        ('cancelled', 'Cancelled'),
    )
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookings')
    yoga_class = models.ForeignKey(YogaClass, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    booking_date = models.DateTimeField(auto_now_add=True)
    occurrence = models.ForeignKey(
    'YogaClassOccurrence',
    on_delete=models.CASCADE,
    related_name='bookings',
    null=True,  # makes migration non-breaking
    blank=True
)


class Announcement(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    published = models.BooleanField(default=True)
    yoga_class = models.ForeignKey(YogaClass, on_delete=models.CASCADE, related_name='announcements', null=True, blank=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
