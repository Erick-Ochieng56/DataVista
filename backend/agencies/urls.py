from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    AgencyViewSet, 
    AgencyAPIConfigViewSet, 
    AgencyUserViewSet
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'agencies', AgencyViewSet)
router.register(r'agency-configs', AgencyAPIConfigViewSet)
router.register(r'agency-users', AgencyUserViewSet)

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),

]