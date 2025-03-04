from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view 
from drf_yasg import openapi

# Swagger/OpenAPI documentation setup
schema_view = get_schema_view(
    openapi.Info(
        title="Crime Analysis API",
        default_version='v1',
        description="API documentation for the Crime Analysis System",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# API versioning pattern
api_patterns = [
    # App-specific API endpoints
    path('accounts/', include('accounts.urls')),
    path('agencies/', include('agencies.urls')),
    path('crimes/', include('crimes.urls')),
    path('alerts/', include('alerts.urls')),
    path('reports/', include('reports.urls')),
    path('analytics/', include('analytics.urls')),
    path('etl/', include('etl.urls')),
    
    # API documentation
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints with versioning
    path('api/v1/', include(api_patterns)),
    
    # For development serving of media files
    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
]