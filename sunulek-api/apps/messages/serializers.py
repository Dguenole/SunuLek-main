from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Conversation, Message

User = get_user_model()


class MessageUserSerializer(serializers.ModelSerializer):
    """Minimal user info for messages."""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'avatar']


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for individual messages."""
    
    sender = MessageUserSerializer(read_only=True)
    is_mine = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'is_read', 'is_mine', 'created_at']
        read_only_fields = ['id', 'sender', 'is_read', 'created_at']
    
    def get_is_mine(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.sender_id == request.user.id
        return False


class ConversationListSerializer(serializers.ModelSerializer):
    """Serializer for conversation list."""
    
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    ad_title = serializers.CharField(source='ad.title', read_only=True)
    ad_slug = serializers.CharField(source='ad.slug', read_only=True)
    ad_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'ad_title', 'ad_slug', 'ad_image', 
            'other_user', 'last_message', 'unread_count', 
            'created_at', 'updated_at'
        ]
    
    def get_other_user(self, obj):
        request = self.context.get('request')
        if request and request.user:
            other = obj.recipient if obj.initiator_id == request.user.id else obj.initiator
            return MessageUserSerializer(other).data
        return None
    
    def get_last_message(self, obj):
        last = obj.messages.first()
        if last:
            return {
                'content': last.content[:100],
                'created_at': last.created_at,
                'is_mine': last.sender_id == self.context.get('request').user.id if self.context.get('request') else False
            }
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.unread_count_for(request.user)
        return 0
    
    def get_ad_image(self, obj):
        primary = obj.ad.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.ad.images.first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
        return None


class ConversationDetailSerializer(serializers.ModelSerializer):
    """Serializer for conversation detail with messages."""
    
    other_user = serializers.SerializerMethodField()
    messages = serializers.SerializerMethodField()
    ad_title = serializers.CharField(source='ad.title', read_only=True)
    ad_slug = serializers.CharField(source='ad.slug', read_only=True)
    ad_image = serializers.SerializerMethodField()
    ad_price = serializers.IntegerField(source='ad.price', read_only=True)
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'ad_title', 'ad_slug', 'ad_image', 'ad_price',
            'other_user', 'messages', 'created_at'
        ]
    
    def get_other_user(self, obj):
        request = self.context.get('request')
        if request and request.user:
            other = obj.recipient if obj.initiator_id == request.user.id else obj.initiator
            return MessageUserSerializer(other).data
        return None
    
    def get_messages(self, obj):
        # Return messages in chronological order (oldest first)
        messages = obj.messages.all().order_by('created_at')
        return MessageSerializer(messages, many=True, context=self.context).data
    
    def get_ad_image(self, obj):
        primary = obj.ad.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.ad.images.first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
        return None


class SendMessageSerializer(serializers.Serializer):
    """Serializer for sending a new message."""
    
    content = serializers.CharField(min_length=1, max_length=2000)


class StartConversationSerializer(serializers.Serializer):
    """Serializer for starting a new conversation."""
    
    ad_id = serializers.IntegerField()
    message = serializers.CharField(min_length=1, max_length=2000)
