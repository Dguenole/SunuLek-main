from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema

from .models import Conversation, Message
from .serializers import (
    ConversationListSerializer,
    ConversationDetailSerializer,
    SendMessageSerializer,
    StartConversationSerializer,
    MessageSerializer,
)
from apps.annonces.models import Ad


@extend_schema(tags=['Messages'])
class ConversationViewSet(viewsets.ViewSet):
    """ViewSet for managing conversations and messages."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """List all conversations for the current user."""
        conversations = Conversation.objects.filter(
            Q(initiator=request.user) | Q(recipient=request.user)
        ).select_related('ad', 'initiator', 'recipient').prefetch_related('messages')
        
        serializer = ConversationListSerializer(
            conversations, many=True, context={'request': request}
        )
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get a specific conversation with all messages."""
        conversation = get_object_or_404(
            Conversation.objects.filter(
                Q(initiator=request.user) | Q(recipient=request.user)
            ),
            pk=pk
        )
        
        # Mark messages as read
        conversation.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)
        
        serializer = ConversationDetailSerializer(conversation, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def start(self, request):
        """Start a new conversation or get existing one."""
        serializer = StartConversationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        ad_id = serializer.validated_data['ad_id']
        message_content = serializer.validated_data['message']
        
        # Get the ad
        ad = get_object_or_404(Ad, id=ad_id)
        
        # Can't message yourself
        if ad.user == request.user:
            return Response(
                {'error': 'Vous ne pouvez pas vous envoyer un message.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create conversation
        conversation, created = Conversation.objects.get_or_create(
            ad=ad,
            initiator=request.user,
            defaults={'recipient': ad.user}
        )
        
        # Create the message
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=message_content
        )
        
        # Update conversation timestamp
        conversation.save()  # This updates updated_at
        
        return Response({
            'conversation_id': conversation.id,
            'message': MessageSerializer(message, context={'request': request}).data,
            'created': created
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """Send a message in an existing conversation."""
        conversation = get_object_or_404(
            Conversation.objects.filter(
                Q(initiator=request.user) | Q(recipient=request.user)
            ),
            pk=pk
        )
        
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=serializer.validated_data['content']
        )
        
        # Update conversation timestamp
        conversation.save()
        
        return Response(
            MessageSerializer(message, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get total unread messages count."""
        conversations = Conversation.objects.filter(
            Q(initiator=request.user) | Q(recipient=request.user)
        )
        total = sum(conv.unread_count_for(request.user) for conv in conversations)
        return Response({'count': total})
