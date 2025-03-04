from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.auth import get_user_model

User = get_user_model()

class Agency(models.Model):
    """Model for law enforcement agencies that provide crime data"""
    name = models.CharField(max_length=255)
    agency_code = models.CharField(max_length=50, unique=True)
    agency_type = models.CharField(max_length=100, choices=[
        ('police', 'Police Department'),
        ('dci', 'Directorate of Criminal Investigations (DCI)'),
        ('nps', 'National Police Service (NPS)'),
        ('ipoa', 'Independent Policing Oversight Authority (IPOA)'),
        ('other', 'Other')
    ])
    
    # Contact information
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=50, blank=True)
    
    # Location information
    jurisdiction_area = gis_models.MultiPolygonField(geography=True, spatial_index=True, null=True, blank=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=20)
    
    # Agency status
    is_active = models.BooleanField(default=True)
    integration_status = models.CharField(max_length=50, choices=[
        ('pending', 'Integration Pending'),
        ('active', 'Integration Active'),
        ('suspended', 'Integration Suspended'),
        ('inactive', 'Integration Inactive')
    ], default='pending')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.agency_code})"
    
    class Meta:
        verbose_name_plural = "Agencies"

class AgencyAPIConfig(models.Model):
    """Model for storing API configuration for agency data integration"""
    agency = models.OneToOneField(Agency, on_delete=models.CASCADE, related_name='api_config')
    api_type = models.CharField(max_length=50, choices=[
        ('rest', 'REST API'),
        ('soap', 'SOAP API'),
        ('ftp', 'FTP Server'),
        ('sftp', 'SFTP Server'),
        ('database', 'Direct Database Connection'),
        ('file', 'File Upload'),
        ('other', 'Other')
    ])
    
    # Connection details (encrypted in production)
    connection_url = models.CharField(max_length=255, blank=True)
    auth_type = models.CharField(max_length=50, choices=[
        ('none', 'No Authentication'),
        ('basic', 'Basic Authentication'),
        ('token', 'Token Authentication'),
        ('oauth', 'OAuth'),
        ('certificate', 'Certificate Authentication'),
        ('other', 'Other')
    ], default='none')
    
    # Connection credentials (would be encrypted in production)
    username = models.CharField(max_length=100, blank=True)
    password = models.CharField(max_length=100, blank=True)
    api_key = models.CharField(max_length=255, blank=True)
    
    # Connection settings
    configuration = models.JSONField(default=dict, blank=True, 
                                    help_text="Additional configuration details specific to integration")
    
    # Sync schedule (cron expression)
    sync_schedule = models.CharField(max_length=100, default="0 0 * * *",  # Default: daily at midnight
                                    help_text="Cron expression for sync schedule")
    
    last_sync = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"API Config for {self.agency.name}"

class AgencyUser(models.Model):
    """Model to associate users with agencies for access control"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='agency_associations')
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='authorized_users')
    role = models.CharField(max_length=50, choices=[
        ('admin', 'Agency Administrator'),
        ('data_provider', 'Data Provider'),
        ('analyst', 'Crime Analyst'),
        ('viewer', 'Data Viewer')
    ])
    is_primary = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.agency.name} ({self.role})"
    
    class Meta:
        unique_together = ('user', 'agency')