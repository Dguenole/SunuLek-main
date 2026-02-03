from rest_framework import serializers
from django.utils.text import slugify
from django.utils import timezone
import uuid
from .models import Ad, AdImage, AdContact


class AdImageSerializer(serializers.ModelSerializer):
    """Serializer for ad images."""
    
    class Meta:
        model = AdImage
        fields = ['id', 'image', 'is_primary', 'order']


class AdListSerializer(serializers.ModelSerializer):
    """Serializer for ad list view (minimal data)."""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    favorites_count = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
    
    class Meta:
        model = Ad
        fields = [
            'id', 'title', 'slug', 'price', 'is_negotiable',
            'region', 'department', 'neighborhood',
            'category_name', 'user_name', 'primary_image',
            'views_count', 'favorites_count', 'is_favorited',
            'is_featured', 'created_at'
        ]
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.images.first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
            return primary.image.url
        return None
    
    def get_favorites_count(self, obj):
        return obj.favorites.count()
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False


class AdDetailSerializer(serializers.ModelSerializer):
    """Serializer for ad detail view (full data)."""
    
    images = AdImageSerializer(many=True, read_only=True)
    category = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    favorites_count = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    
    class Meta:
        model = Ad
        fields = [
            'id', 'title', 'slug', 'description', 'price', 'is_negotiable',
            'region', 'department', 'neighborhood', 'address',
            'category', 'user', 'images', 'status',
            'views_count', 'favorites_count', 'is_favorited', 'is_featured',
            'is_owner', 'created_at', 'published_at'
        ]
    
    def get_category(self, obj):
        if obj.category:
            return {'id': obj.category.id, 'name': obj.category.name, 'slug': obj.category.slug}
        return None
    
    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'full_name': obj.user.full_name,
            'avatar': obj.user.avatar.url if obj.user.avatar else None,
            'phone': obj.user.phone,
            'date_joined': obj.user.date_joined,
        }
    
    def get_favorites_count(self, obj):
        return obj.favorites.count()
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False
    
    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.user == request.user
        return False


class AdCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating ads."""
    
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Ad
        fields = [
            'title', 'description', 'price', 'is_negotiable',
            'category', 'region', 'department', 'neighborhood', 'address',
            'images'
        ]
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        
        # Generate unique slug
        base_slug = slugify(validated_data['title'])
        slug = f"{base_slug}-{uuid.uuid4().hex[:8]}"
        
        ad = Ad.objects.create(
            slug=slug,
            user=self.context['request'].user,
            published_at=timezone.now(),
            **validated_data
        )
        
        # Create images
        for i, image in enumerate(images_data):
            AdImage.objects.create(
                ad=ad,
                image=image,
                is_primary=(i == 0),
                order=i
            )
        
        return ad
    
    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # If new images provided, replace existing
        if images_data:
            instance.images.all().delete()
            for i, image in enumerate(images_data):
                AdImage.objects.create(
                    ad=instance,
                    image=image,
                    is_primary=(i == 0),
                    order=i
                )
        
        return instance


class AdContactSerializer(serializers.ModelSerializer):
    """Serializer for contacting ad owner."""
    
    sender_name = serializers.CharField(source='sender.full_name', read_only=True)
    ad_title = serializers.CharField(source='ad.title', read_only=True)
    
    class Meta:
        model = AdContact
        fields = ['id', 'ad', 'message', 'phone', 'sender_name', 'ad_title', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender_name', 'ad_title', 'is_read', 'created_at']
    
    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)
