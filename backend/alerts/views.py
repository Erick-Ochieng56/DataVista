from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance

from .models import Alert, AlertNotification
from .serializers import AlertSerializer, AlertNotificationSerializer
from crimes.models import Crime

class AlertViewSet(viewsets.ModelViewSet):
    """ViewSet for handling Alert operations"""
    serializer_class = AlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return only alerts for the current user"""
        return Alert.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['GET'])
    def active_alerts(self, request):
        """Retrieve only active alerts for the current user"""
        active_alerts = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_alerts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['GET'])
    def recent_matches(self, request, pk=None):
        """
        Retrieve recent crimes that match this alert's criteria
        """
        alert = self.get_object()
        
        # Find matching crimes within the search radius
        matching_crimes = Crime.objects.filter(
            crime_type__in=alert.crime_types.all(),
            location__distance_lte=(alert.location, D(m=alert.search_distance_meters))
        ).annotate(
            distance=Distance('location', alert.location)
        ).order_by('distance')
        
        # Return the matching crimes
        return Response({
            'alert_id': alert.id,
            'total_matches': matching_crimes.count(),
            'matches': [
                {
                    'id': crime.id,
                    'type': crime.crime_type.name,
                    'occurred_at': crime.occurred_at,
                    'distance_meters': crime.distance.m
                } for crime in matching_crimes[:10]  # Limit to 10 most recent/closest
            ]
        })

class AlertNotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for handling Alert Notifications"""
    serializer_class = AlertNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return notifications for alerts owned by the current user"""
        return AlertNotification.objects.filter(alert__user=self.request.user)