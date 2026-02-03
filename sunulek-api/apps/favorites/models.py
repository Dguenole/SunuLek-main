from django.db import models
from django.conf import settings
from apps.annonces.models import Ad


class Favorite(models.Model):
    """User's favorite ads."""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorites',
        verbose_name='Utilisateur'
    )
    ad = models.ForeignKey(
        Ad,
        on_delete=models.CASCADE,
        related_name='favorites',
        verbose_name='Annonce'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date d\'ajout')
    
    class Meta:
        verbose_name = 'Favori'
        verbose_name_plural = 'Favoris'
        ordering = ['-created_at']
        unique_together = ['user', 'ad']  # Prevent duplicate favorites
    
    def __str__(self):
        return f"{self.user.email} - {self.ad.title}"
