from django.db import models
from django.conf import settings


class Conversation(models.Model):
    """
    A conversation between two users about an ad.
    """
    ad = models.ForeignKey(
        'annonces.Ad',
        on_delete=models.CASCADE,
        related_name='conversations',
        verbose_name='Annonce'
    )
    # The user who initiated the conversation (buyer/interested party)
    initiator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='initiated_conversations',
        verbose_name='Initiateur'
    )
    # The ad owner (seller)
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_conversations',
        verbose_name='Destinataire'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Conversation'
        verbose_name_plural = 'Conversations'
        ordering = ['-updated_at']
        # Ensure only one conversation per ad per initiator
        unique_together = ['ad', 'initiator']
    
    def __str__(self):
        return f"Conversation: {self.initiator.email} → {self.recipient.email} ({self.ad.title})"
    
    @property
    def last_message(self):
        return self.messages.first()
    
    def unread_count_for(self, user):
        """Count unread messages for a specific user."""
        return self.messages.filter(is_read=False).exclude(sender=user).count()


class Message(models.Model):
    """
    A single message in a conversation.
    """
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name='Conversation'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages',
        verbose_name='Expéditeur'
    )
    content = models.TextField(verbose_name='Contenu')
    
    # Status
    is_read = models.BooleanField(default=False, verbose_name='Lu')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message de {self.sender.email} - {self.created_at}"
