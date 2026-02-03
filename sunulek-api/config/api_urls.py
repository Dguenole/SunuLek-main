"""
API v1 URL Configuration
"""

from django.urls import path, include

urlpatterns = [
    path('auth/', include('apps.users.urls')),
    path('annonces/', include('apps.annonces.urls')),
    path('categories/', include('apps.categories.urls')),
    path('favorites/', include('apps.favorites.urls')),
]
