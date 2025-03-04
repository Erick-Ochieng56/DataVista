from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import CrimeCategory, CrimeType, Crime, CrimeAttribute
from .serializers import (
    CrimeCategorySerializer,
    CrimeTypeDetailSerializer, 
    CrimeTypeSerializer, 
    CrimeSerializer, 
    CrimeDetailSerializer, 
    CrimeCreateUpdateSerializer,
    CrimeGeoSerializer,
    CrimeAttributeSerializer
)

class CrimeCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on Crime Categories
    """
    queryset = CrimeCategory.objects.all()
    serializer_class = CrimeCategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']

class CrimeTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on Crime Types
    """
    queryset = CrimeType.objects.select_related('category').all()
    serializer_class = CrimeTypeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'description']
    filterset_fields = ['category', 'severity_level']
    ordering_fields = ['name', 'severity_level']

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return CrimeTypeDetailSerializer
        return CrimeTypeSerializer

class CrimeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on Crime Incidents
    """
    queryset = Crime.objects.select_related(
        'crime_type', 
        'crime_type__category', 
        'agency'
    ).prefetch_related('attributes').all()
    filter_backends = [
        filters.SearchFilter, 
        filters.OrderingFilter, 
        DjangoFilterBackend
    ]
    filterset_fields = [
        'crime_type', 
        'agency', 
        'city', 
        'state', 
        'verification_status',
        'occurred_at',
        'reported_at'
    ]
    search_fields = [
        'description', 
        'block_address', 
        'zip_code'
    ]
    ordering_fields = [
        'occurred_at', 
        'reported_at', 
        'created_at'
    ]

    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update':
            return CrimeCreateUpdateSerializer
        elif self.action in ['retrieve', 'list']:
            return CrimeDetailSerializer
        elif self.action == 'spatial':
            return CrimeGeoSerializer
        return CrimeSerializer

class CrimeAttributeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on Crime Attributes
    """
    queryset = CrimeAttribute.objects.select_related('crime').all()
    serializer_class = CrimeAttributeSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['crime', 'name']
    search_fields = ['name', 'value']