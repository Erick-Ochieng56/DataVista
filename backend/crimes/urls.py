from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CrimeCategoryViewSet, 
    CrimeTypeViewSet, 
    CrimeViewSet,
    CrimeAttributeViewSet
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'categories', CrimeCategoryViewSet, basename='crime-category')
router.register(r'types', CrimeTypeViewSet, basename='crime-type')
router.register(r'incidents', CrimeViewSet, basename='crime')
router.register(r'attributes', CrimeAttributeViewSet, basename='crime-attribute')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
]