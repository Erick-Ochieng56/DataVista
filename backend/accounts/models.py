from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    """Extended user model for the crime analysis system"""
    # Additional user information
    phone_number = models.CharField(max_length=20, blank=True)
    
    # User preferences
    THEME_CHOICES = (
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('system', 'System Default')
    )
    theme_preference = models.CharField(max_length=10, choices=THEME_CHOICES, default='system')
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=True)
    
    # Account verification
    is_email_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=255, blank=True)
    
    # User type for access control
    USER_TYPES = (
        ('public', 'Public User'),
        ('agency', 'Agency User'),
        ('admin', 'System Administrator'),
        ('analyst', 'Crime Analyst')
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='public')
    
    # Account metadata
    created_ip = models.GenericIPAddressField(null=True, blank=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
    
    def __str__(self):
        return self.username

class UserProfile(models.Model):
    """Extended profile information for users"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Profile information
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    
    # Address information (optional for notifications/reports)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, default='United States')
    
    # Account preferences
    default_search_radius = models.IntegerField(default=1000, help_text="Default search radius in meters")
    
    # Additional metadata
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Profile for {self.user.username}"

class LoginHistory(models.Model):
    """Model to track user login history for security purposes"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_history')
    login_time = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    device_type = models.CharField(max_length=50, blank=True)
    
    # Login status
    was_successful = models.BooleanField(default=True)
    failure_reason = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        status = "Success" if self.was_successful else "Failed"
        return f"{status} login for {self.user.username} at {self.login_time}"
    
    class Meta:
        verbose_name_plural = "Login Histories"
        ordering = ['-login_time']