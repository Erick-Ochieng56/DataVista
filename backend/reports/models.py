from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.gis.db import models as gis_models

User = get_user_model()

class Report(models.Model):
    """Model for storing generated crime reports"""
    # Report identification
    title = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    
    # Report parameters (serialized filters applied to generate the report)
    parameters = models.JSONField(help_text="Search/filter parameters used to generate the report")
    
    # Area of interest
    area_of_interest = gis_models.PolygonField(geography=True, spatial_index=True, null=True, blank=True)
    
    # Time range
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Report format
    REPORT_FORMATS = (
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
        ('json', 'JSON'),
    )
    format = models.CharField(max_length=10, choices=REPORT_FORMATS, default='pdf')
    
    # Report file path
    file = models.FileField(upload_to='reports/', null=True, blank=True)
    
    # Processing status
    STATUS_CHOICES = (
        ('pending', 'Pending Generation'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('expired', 'Expired')
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    status_message = models.TextField(blank=True)
    
    # Report generation settings
    include_charts = models.BooleanField(default=True)
    include_maps = models.BooleanField(default=True)
    include_trends = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True, 
                                     help_text="When the report file will be deleted")
    
    def __str__(self):
        return f"{self.title} - {self.created_at.date()}"

class ReportTemplate(models.Model):
    """Model for storing report templates"""
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Template type
    TEMPLATE_TYPES = (
        ('standard', 'Standard Report'),
        ('executive', 'Executive Summary'),
        ('analytical', 'Analytical Report'),
        ('statistical', 'Statistical Report'),
        ('custom', 'Custom Report')
    )
    template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPES, default='standard')
    
    # Template format
    format = models.CharField(max_length=10, choices=Report.REPORT_FORMATS, default='pdf')
    
    # Template file/content
    template_file = models.FileField(upload_to='report_templates/', null=True, blank=True)
    template_html = models.TextField(blank=True, help_text="HTML template content")
    
    # Components to include
    sections = models.JSONField(default=list, blank=True, 
                               help_text="Sections to include in the report")
    
    # Accessibility
    is_public = models.BooleanField(default=False, help_text="Whether this template is available to all users")
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                             related_name='owned_templates')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.template_type})"

class ScheduledReport(models.Model):
    """Model for reports that are generated on a schedule"""
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scheduled_reports')
    
    # Report configuration
    template = models.ForeignKey(ReportTemplate, on_delete=models.CASCADE, related_name='scheduled_usages')
    parameters = models.JSONField(help_text="Parameters to use for report generation")
    
    # Schedule configuration
    frequency = models.CharField(max_length=20, choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('biweekly', 'Bi-Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly')
    ])
    day_of_week = models.IntegerField(null=True, blank=True, 
                                     help_text="Day of week (0-6, Monday is 0)")
    day_of_month = models.IntegerField(null=True, blank=True, 
                                      help_text="Day of month (1-31)")
    hour = models.IntegerField(default=0, help_text="Hour of day (0-23)")
    minute = models.IntegerField(default=0, help_text="Minute (0-59)")
    
    # Delivery options
    delivery_email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_generated = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} - {self.frequency}"