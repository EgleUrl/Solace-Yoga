"""
Custom authentication logic for Solace Yoga using Django REST Framework and Simple JWT.

Features:
- Login via username or email (hybrid login)
- Secure JWT token handling:
    • Access token returned to frontend (stored in memory)
    • Refresh token stored as HttpOnly cookie (for security)
- Role-based token claims (client, teacher, admin)
- Custom token refresh flow using cookie-based refresh
- Prevents refresh token from being exposed in frontend JSON

This setup provides a secure hybrid authentication model suitable for frontend-SPA (React) apps.
"""


from django.contrib.auth import get_user_model, authenticate
from django.db.models import Q
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get('username')
        password = attrs.get('password')

        user = User.objects.filter(Q(username=username_or_email) | Q(email=username_or_email)).first()

        if user is None:
            raise serializers.ValidationError('No user found with this username or email')

        if not user.check_password(password):
            raise serializers.ValidationError('Invalid credentials')

        # Manually generate tokens
        refresh = RefreshToken.for_user(user)

        # Add custom claim: role
        refresh['role'] = user.role
        refresh['user_id'] = user.id

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
            }
        }
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer  

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        tokens = response.data

        response.set_cookie(
            key='refresh_token',
            value=tokens['refresh'],
            httponly=True,
            secure=False,
            samesite='Lax',
            path='/api/token/refresh/',
        )

        response.data.pop('refresh', None)

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({'error': 'Refresh token not found in cookie.'}, status=status.HTTP_401_UNAUTHORIZED)

        request.data['refresh'] = refresh_token
        response = super().post(request, *args, **kwargs)

        return response

