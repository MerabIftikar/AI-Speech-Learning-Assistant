from django.contrib import admin
from django.urls import path
from api.views import assess_speech
# Swagger ke liye imports
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/assess-speech/', assess_speech),
    
    # Swagger Documentation Paths (Marium's Requirement)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]