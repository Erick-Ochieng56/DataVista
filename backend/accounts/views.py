from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings

from .models import User, UserProfile, LoginHistory
from .serializers import (
    UserSerializer, 
    UserProfileSerializer, 
    UserRegistrationSerializer,
    LoginHistorySerializer
)

class UserViewSet(viewsets.ModelViewSet):
    """
    Viewset for user management and authentication
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        """
        Return appropriate serializer based on action
        """
        if self.action == 'create' or self.action == 'register':
            return UserRegistrationSerializer
        return UserSerializer

    @action(detail=False, methods=['POST'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """
        User registration endpoint
        """
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Optional: Send verification email
            verification_token = get_random_string(length=32)
            user.verification_token = verification_token
            user.save()
            
            # Uncomment and configure email verification logic
            self._send_verification_email(user)
            
            # Return user data along with success message
            user_data = UserSerializer(user).data
            
            return Response({
                'message': 'User registered successfully', 
                'user': user_data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        """
        User login endpoint with login history tracking
        """
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            login(request, user)
            
            # Log login history
            LoginHistory.objects.create(
                user=user,
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                device_type=self._get_device_type(request),
                was_successful=True
            )
            
            # Return user data along with success message
            user_data = UserSerializer(user).data
            
            return Response({
                'message': 'Login successful',
                'user': user_data
            })
        else:
            # Try to find user to log failed attempt
            try:
                user_obj = User.objects.get(username=username)
                # Log failed login attempt
                LoginHistory.objects.create(
                    user=user_obj,
                    ip_address=self._get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    device_type=self._get_device_type(request),
                    was_successful=False,
                    failure_reason='Invalid credentials'
                )
            except User.DoesNotExist:
                # User doesn't exist, just pass
                pass
            
            return Response({
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """
        User logout endpoint
        """
        logout(request)
        return Response({'message': 'Logged out successfully'})

    def _get_client_ip(self, request):
        """
        Get client IP address from request
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def _get_device_type(self, request):
        """
        Detect device type from user agent
        """
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        if 'mobile' in user_agent:
            return 'Mobile'
        elif 'tablet' in user_agent:
            return 'Tablet'
        return 'Desktop'

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    Viewset for user profile management
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Limit queryset to logged-in user's profile
        """
        return UserProfile.objects.filter(user=self.request.user)

class LoginHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for viewing login history
    """
    serializer_class = LoginHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Limit queryset to logged-in user's login history
        """
        return LoginHistory.objects.filter(user=self.request.user)