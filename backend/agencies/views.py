from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Agency, AgencyAPIConfig, AgencyUser
from .serializers import (
    AgencySerializer, 
    AgencyAPIConfigSerializer, 
    AgencyUserSerializer
)

class AgencyViewSet(viewsets.ModelViewSet):
    """
    Viewset for Agency model with additional actions
    """
    queryset = Agency.objects.all()
    serializer_class = AgencySerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'])
    def api_config(self, request, pk=None):
        """
        Retrieve API configuration for a specific agency
        """
        agency = self.get_object()
        try:
            api_config = agency.api_config
            serializer = AgencyAPIConfigSerializer(api_config)
            return Response(serializer.data)
        except AgencyAPIConfig.DoesNotExist:
            return Response({
                'error': 'No API configuration found for this agency'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def authorized_users(self, request, pk=None):
        """
        List authorized users for a specific agency
        """
        agency = self.get_object()
        agency_users = AgencyUser.objects.filter(agency=agency)
        serializer = AgencyUserSerializer(agency_users, many=True)
        return Response(serializer.data)

class AgencyAPIConfigViewSet(viewsets.ModelViewSet):
    """
    Viewset for AgencyAPIConfig model
    """
    queryset = AgencyAPIConfig.objects.all()
    serializer_class = AgencyAPIConfigSerializer
    permission_classes = [permissions.IsAuthenticated]

class AgencyUserViewSet(viewsets.ModelViewSet):
    """
    Viewset for AgencyUser model
    """
    queryset = AgencyUser.objects.all()
    serializer_class = AgencyUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Optionally filter queryset by agency or user
        """
        queryset = AgencyUser.objects.all()
        agency_id = self.request.query_params.get('agency_id')
        user_id = self.request.query_params.get('user_id')

        if agency_id:
            queryset = queryset.filter(agency_id=agency_id)
        if user_id:
            queryset = queryset.filter(user_id=user_id)

        return queryset