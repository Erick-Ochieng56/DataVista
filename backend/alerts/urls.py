from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlertViewSet, AlertNotificationViewSet

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'alerts', AlertViewSet, basename='alert')
router.register(r'alert-notifications', AlertNotificationViewSet, basename='alert-notification')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
]