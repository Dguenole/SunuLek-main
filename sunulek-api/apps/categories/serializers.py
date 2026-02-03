from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for categories."""
    
    ads_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'image', 'ads_count']
    
    def get_ads_count(self, obj):
        return obj.ads.filter(is_active=True).count()
