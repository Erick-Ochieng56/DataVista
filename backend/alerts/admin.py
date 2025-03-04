from django.contrib import admin
from django.contrib.gis.admin import GeoModelAdmin
from .models import Alert, AlertNotification

@admin.register(Alert)
class AlertAdmin(GeoModelAdmin):
    """Admin configuration for Alert model"""
    list_display = ('name', 'user', 'is_active', 'notification_method', 'check_frequency')
    list_filter = ('is_active', 'crime_types', 'notification_method', 'check_frequency')
    search_fields = ('name', 'user__username', 'address')
    
    # Configure the map widget for location
    default_zoom = 10
    default_lon = -98.5795  # Adjust to your preferred default longitude
    default_lat = 39.8283   # Adjust to your preferred default latitude

@admin.register(AlertNotification)
class AlertNotificationAdmin(admin.ModelAdmin):
    """Admin configuration for AlertNotification model"""
    list_display = ('alert', 'sent_at', 'notification_method', 'status')
    list_filter = ('notification_method', 'status', 'sent_at')
    search_fields = ('alert__name', 'alert__user__username')