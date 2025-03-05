from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
from django.contrib.auth import get_user_model
from crimes.models import CrimeType
from leaflet.forms.widgets import LeafletWidget

User = get_user_model()

class Alert(models.Model):
    """Model for user-created crime alerts"""
    # Alert identification
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='alerts')
    
    # Alert criteria
    crime_types = models.ManyToManyField(CrimeType, related_name='alerts')
    
    # Location for alert
    location = gis_models.PointField(geography=True, spatial_index=True)
    address = models.CharField(max_length=255, blank=True)
    search_distance_meters = models.IntegerField(default=1000, 
                                               help_text="Radius in meters from the specified location")
    
    # Alert settings
    is_active = models.BooleanField(default=True)
    
    # Notification settings
    NOTIFICATION_METHODS = (
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
        ('in_app', 'In-App Only')
    )
    notification_method = models.CharField(max_length=20, choices=NOTIFICATION_METHODS, default='email')
    
    # Time settings (when to check for matches)
    check_frequency = models.CharField(max_length=20, choices=[
        ('realtime', 'Real-time'),
        ('hourly', 'Hourly'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly')
    ], default='daily')
    
    # SMS or additional email for notifications
    notification_contact = models.CharField(max_length=255, blank=True, 
                                          help_text="Phone number or email for notifications")
    
    # Alert metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Helper methods
    def set_location(self, longitude, latitude):
        """Set alert location using longitude and latitude"""
        self.location = Point(longitude, latitude, srid=4326)
    
    def __str__(self):
        return f"{self.name} - {self.user.username}"

class AlertNotification(models.Model):
    """Model for tracking notifications sent for alerts"""
    alert = models.ForeignKey(Alert, on_delete=models.CASCADE, related_name='notifications')
    crime_ids = models.JSONField(help_text="IDs of crimes that triggered this notification")
    
    sent_at = models.DateTimeField(auto_now_add=True)
    notification_method = models.CharField(max_length=20, choices=Alert.NOTIFICATION_METHODS)
    
    # Status of notification
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('received', 'Received'),
        ('read', 'Read')
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    status_message = models.TextField(blank=True)
    
    def __str__(self):
        return f"Notification for {self.alert.name} at {self.sent_at}"