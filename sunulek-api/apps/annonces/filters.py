import django_filters
from .models import Ad


class AdFilter(django_filters.FilterSet):
    """Filter for ads."""
    
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category__slug')
    region = django_filters.CharFilter(lookup_expr='iexact')
    department = django_filters.CharFilter(lookup_expr='iexact')
    
    class Meta:
        model = Ad
        fields = ['category', 'region', 'department', 'is_negotiable', 'is_featured']
