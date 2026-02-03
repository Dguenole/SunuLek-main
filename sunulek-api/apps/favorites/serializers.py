from rest_framework import serializers
from .models import Favorite
from apps.annonces.serializers import AdListSerializer


class FavoriteSerializer(serializers.ModelSerializer):
    """Serializer for favorites."""
    
    ad = AdListSerializer(read_only=True)
    ad_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'ad', 'ad_id', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_ad_id(self, value):
        from apps.annonces.models import Ad
        try:
            Ad.objects.get(id=value, is_active=True)
        except Ad.DoesNotExist:
            raise serializers.ValidationError("Annonce non trouvée.")
        return value
    
    def create(self, validated_data):
        from apps.annonces.models import Ad
        ad = Ad.objects.get(id=validated_data['ad_id'])
        user = self.context['request'].user
        
        # Check if already favorited
        favorite, created = Favorite.objects.get_or_create(user=user, ad=ad)
        if not created:
            raise serializers.ValidationError({'error': 'Cette annonce est déjà dans vos favoris.'})
        
        return favorite
