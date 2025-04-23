# Models for the Django admin interface
# This file registers the models with the Django admin site so they can be managed through the admin interface.
from django.contrib import admin
from .models import CustomUser, TeacherProfile, YogaClass, YogaClassOccurrence, Booking, Announcement

admin.site.register(CustomUser)
admin.site.register(TeacherProfile)
admin.site.register(YogaClass)
admin.site.register(YogaClassOccurrence)
admin.site.register(Booking)
admin.site.register(Announcement)


# Register your models here.
