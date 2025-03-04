from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    UserViewSet, 
    UserProfileViewSet, 
    LoginHistoryViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'login-history', LoginHistoryViewSet, basename='login-history')

urlpatterns = [
    path('', include(router.urls)),
    
    # Custom authentication endpoints
    path('auth/register/', UserViewSet.as_view({'post': 'register'}), name='user-register'),
    path('auth/login/', UserViewSet.as_view({'post': 'login'}), name='user-login'),
    path('auth/logout/', UserViewSet.as_view({'post': 'logout'}), name='user-logout'),
]