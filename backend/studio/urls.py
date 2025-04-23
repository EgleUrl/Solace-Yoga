# Routing for the studio app

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, UserViewSet, TeacherProfileViewSet,
    YogaClassViewSet, YogaClassOccurrenceViewSet, BookingViewSet, AnnouncementViewSet, GoogleLoginView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teachers', TeacherProfileViewSet)
router.register(r'classes', YogaClassViewSet, basename='yogaclass')
router.register(r'occurrences', YogaClassOccurrenceViewSet, basename='occurrences')
router.register(r'bookings', BookingViewSet)
router.register(r'announcements', AnnouncementViewSet, basename='announcements')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),
    path('', include(router.urls)),
]

