from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User, UserProfile, LoginHistory

class UserProfileInline(admin.StackedInline):
    """
    Inline admin configuration for UserProfile
    """
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    extra = 1

class LoginHistoryInline(admin.TabularInline):
    """
    Inline admin configuration for LoginHistory
    """
    model = LoginHistory
    readonly_fields = ('login_time', 'ip_address', 'user_agent', 
                       'device_type', 'was_successful')
    extra = 0
    can_delete = False

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom admin configuration for User model
    """
    list_display = ('username', 'email', 'first_name', 'last_name', 
                    'user_type', 'is_staff', 'is_active')
    list_filter = ('user_type', 'is_staff', 'is_active', 'is_email_verified')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email', 'phone_number')}),
        (_('Permissions'), {
            'fields': (
                'is_active', 'is_staff', 'is_superuser', 
                'user_type', 'is_email_verified'
            ),
        }),
        (_('User Preferences'), {'fields': ('theme_preference', 'email_notifications', 
                                             'sms_notifications', 'push_notifications')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'user_type'),
        }),
    )
    
    inlines = [UserProfileInline, LoginHistoryInline]

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    Admin configuration for UserProfile model
    """
    list_display = ('user', 'city', 'state', 'country', 'default_search_radius')
    search_fields = ('user__username', 'city', 'state', 'country')
    list_filter = ('country',)

@admin.register(LoginHistory)
class LoginHistoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for LoginHistory model
    """
    list_display = ('user', 'login_time', 'ip_address', 'was_successful')
    list_filter = ('was_successful', 'login_time')
    search_fields = ('user__username', 'ip_address')
    readonly_fields = ('login_time', 'ip_address', 'user_agent', 
                       'device_type', 'was_successful', 'failure_reason')