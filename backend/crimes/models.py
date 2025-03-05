from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
from django.contrib.postgres.indexes import GinIndex
from django.utils.translation import gettext_lazy as _
from agencies.models import Agency

class CrimeCategory(models.Model):
    """Model for categorizing types of crimes"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Crime Categories"

class CrimeType(models.Model):
    """Model for specific types of crimes within categories"""
    category = models.ForeignKey(CrimeCategory, on_delete=models.CASCADE, related_name='crime_types')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    severity_level = models.IntegerField(choices=[
        (1, 'Low'),
        (2, 'Medium'),
        (3, 'High'),
        (4, 'Critical')
    ], default=2)
    
    def __str__(self):
        return f"{self.name} ({self.category.name})"
    
    class Meta:
        unique_together = ('category', 'name')

class Crime(models.Model):
    """Model for storing individual crime incidents"""
    # Unique identifier from source system
    incident_id = models.CharField(max_length=100, unique=True)
    
    # Crime details
    crime_type = models.ForeignKey(CrimeType, on_delete=models.PROTECT, related_name='crimes')
    description = models.TextField(blank=True)
    
    # Dates and times
    occurred_at = models.DateTimeField()
    reported_at = models.DateTimeField()
    
    # Source information
    agency = models.ForeignKey(Agency, on_delete=models.PROTECT, related_name='reported_crimes')
    data_source = models.CharField(max_length=100, help_text="Source system or feed")
    
    # Location data (generalized for privacy)
    location = gis_models.PointField(geography=True, spatial_index=True)
    block_address = models.CharField(max_length=255, help_text="Generalized address at block level")
    zip_code = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=50, db_index=True)
    country = models.CharField(max_length=50, default="Kenya")
    
    # Verification status
    VERIFICATION_STATUS = (
        ('unverified', 'Unverified'),
        ('verified', 'Verified'),
        ('suspicious', 'Suspicious Data'),
        ('corrected', 'Data Corrected')
    )
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='unverified')
    
    # System metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, help_text="Soft delete flag")
    
    # Methods to work with geographic data
    def set_location(self, longitude, latitude):
        """Set location using longitude and latitude"""
        self.location = Point(longitude, latitude, srid=4326)
    
    def __str__(self):
        return f"{self.crime_type.name} at {self.block_address} on {self.occurred_at.date()}"
    
    class Meta:
        indexes = [
            models.Index(fields=['occurred_at']),
            models.Index(fields=['reported_at']),
            models.Index(fields=['verification_status']),
            models.Index(fields=['zip_code']),
            models.Index(fields=['city']),
             GinIndex(fields=['block_address'], opclasses=['gin_trgm_ops'],name='block_address_gin_idx'),  # Fix
        ]
        ordering = ['-occurred_at']

class CrimeAttribute(models.Model):
    """Model for storing additional attributes of crimes that may vary by crime type"""
    crime = models.ForeignKey(Crime, on_delete=models.CASCADE, related_name='attributes')
    name = models.CharField(max_length=100)
    value = models.JSONField(help_text="Flexible storage for various attribute types")
    
    def __str__(self):
        return f"{self.name}: {self.value}"
    
    class Meta:
        unique_together = ('crime', 'name')