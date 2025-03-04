from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DataSourceViewSet, 
    ETLJobViewSet, 
    DataValidationRuleViewSet, 
    ETLJobLogViewSet
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'data-sources', DataSourceViewSet)
router.register(r'etl-jobs', ETLJobViewSet)
router.register(r'validation-rules', DataValidationRuleViewSet)
router.register(r'job-logs', ETLJobLogViewSet)

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
]