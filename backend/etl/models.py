from django.db import models
from agencies.models import Agency

class DataSource(models.Model):
    """Model for tracking external data sources from agencies"""
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='data_sources')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Source type
    SOURCE_TYPES = (
        ('api', 'REST API'),
        ('database', 'Database Connection'),
        ('file', 'File Import'),
        ('feed', 'Data Feed'),
        ('scraper', 'Web Scraper'),
        ('manual', 'Manual Entry')
    )
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPES)
    
    # Configuration for the data source
    configuration = models.JSONField(default=dict, blank=True, 
                                    help_text="Configuration details for this source")
    
    # Source status
    is_active = models.BooleanField(default=True)
    
    # Data mapping schema
    field_mapping = models.JSONField(default=dict, blank=True,
                                    help_text="Mapping between source fields and system fields")
    
    # Schedule
    sync_frequency = models.CharField(max_length=50, choices=[
        ('realtime', 'Real-time'),
        ('hourly', 'Hourly'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('on_demand', 'On Demand')
    ], default='daily')
    
    # For cron-style scheduling
    cron_expression = models.CharField(max_length=100, blank=True,
                                     help_text="Cron expression for custom scheduling")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.agency.name}"

class ETLJob(models.Model):
    """Model for tracking individual ETL jobs"""
    data_source = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name='etl_jobs')
    
    # Job identification
    job_id = models.CharField(max_length=100, unique=True)
    
    # Job status
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('canceled', 'Canceled')
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    # Job details
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    
    # Processing metrics
    records_processed = models.IntegerField(default=0)
    records_created = models.IntegerField(default=0)
    records_updated = models.IntegerField(default=0)
    records_skipped = models.IntegerField(default=0)
    records_failed = models.IntegerField(default=0)
    
    # Job parameters
    parameters = models.JSONField(default=dict, blank=True,
                                help_text="Parameters used for this ETL job")
    
    # Error information
    error_message = models.TextField(blank=True)
    error_details = models.JSONField(null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"ETL Job {self.job_id} - {self.status}"
    
    class Meta:
        ordering = ['-created_at']

class DataValidationRule(models.Model):
    """Model for defining data validation rules for ETL processes"""
    data_source = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name='validation_rules')
    
    # Rule identification
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Rule type
    RULE_TYPES = (
        ('required', 'Required Field'),
        ('format', 'Format Validation'),
        ('range', 'Range Check'),
        ('enum', 'Enumeration Check'),
        ('unique', 'Uniqueness Check'),
        ('reference', 'Reference Check'),
        ('custom', 'Custom Validation')
    )
    rule_type = models.CharField(max_length=20, choices=RULE_TYPES)
    
    # Field this rule applies to
    field_name = models.CharField(max_length=100)
    
    # Rule configuration
    configuration = models.JSONField(help_text="Configuration for this validation rule")
    
    # Error handling
    ERROR_ACTIONS = (
        ('reject', 'Reject Record'),
        ('warn', 'Log Warning'),
        ('correct', 'Auto-correct'),
        ('ignore', 'Ignore')
    )
    error_action = models.CharField(max_length=20, choices=ERROR_ACTIONS, default='warn')
    
    # Rule priority
    priority = models.IntegerField(default=1, help_text="Order in which rules are applied (1 is highest)")
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.field_name}"
    
    class Meta:
        ordering = ['priority']

class ETLJobLog(models.Model):
    """Model for detailed logging of ETL processes"""
    job = models.ForeignKey(ETLJob, on_delete=models.CASCADE, related_name='logs')
    
    # Log level
    LOG_LEVELS = (
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('critical', 'Critical')
    )
    level = models.CharField(max_length=10, choices=LOG_LEVELS, default='info')
    
    # Log message
    message = models.TextField()
    
    # Additional context
    context = models.JSONField(null=True, blank=True)
    
    # Source record identification (if applicable)
    source_record_id = models.CharField(max_length=255, blank=True)
    
    # Timestamp
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.level.upper()}: {self.message[:50]}..."
    
    class Meta:
        ordering = ['-timestamp']
