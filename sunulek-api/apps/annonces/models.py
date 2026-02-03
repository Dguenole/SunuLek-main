from django.db import models
from django.conf import settings
from apps.categories.models import Category


class Ad(models.Model):
    """Ad/Annonce model."""
    
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Brouillon'
        PENDING = 'pending', 'En attente de validation'
        ACTIVE = 'active', 'Active'
        SOLD = 'sold', 'Vendu'
        EXPIRED = 'expired', 'Expirée'
        REJECTED = 'rejected', 'Rejetée'
    
    # Basic info
    title = models.CharField(max_length=200, verbose_name='Titre')
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(verbose_name='Description')
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Prix')
    is_negotiable = models.BooleanField(default=True, verbose_name='Prix négociable')
    
    # Relations
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ads',
        verbose_name='Vendeur'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='ads',
        verbose_name='Catégorie'
    )
    
    # Location (Senegal specific)
    region = models.CharField(max_length=100, verbose_name='Région')
    department = models.CharField(max_length=100, verbose_name='Département')
    neighborhood = models.CharField(max_length=100, blank=True, verbose_name='Quartier')
    address = models.CharField(max_length=255, blank=True, verbose_name='Adresse')
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name='Statut'
    )
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, verbose_name='Mise en avant')
    
    # Stats
    views_count = models.PositiveIntegerField(default=0, verbose_name='Nombre de vues')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Dernière modification')
    published_at = models.DateTimeField(null=True, blank=True, verbose_name='Date de publication')
    expires_at = models.DateTimeField(null=True, blank=True, verbose_name='Date d\'expiration')
    
    class Meta:
        verbose_name = 'Annonce'
        verbose_name_plural = 'Annonces'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['category']),
            models.Index(fields=['region', 'department']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return self.title
    
    def increment_views(self):
        """Increment view count."""
        self.views_count += 1
        self.save(update_fields=['views_count'])


class AdImage(models.Model):
    """Images for an ad."""
    
    ad = models.ForeignKey(
        Ad,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Annonce'
    )
    image = models.ImageField(upload_to='ads/%Y/%m/', verbose_name='Image')
    is_primary = models.BooleanField(default=False, verbose_name='Image principale')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordre')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Image d\'annonce'
        verbose_name_plural = 'Images d\'annonces'
        ordering = ['order', '-is_primary']
    
    def __str__(self):
        return f"Image pour {self.ad.title}"


class AdContact(models.Model):
    """Contact messages for an ad."""
    
    ad = models.ForeignKey(
        Ad,
        on_delete=models.CASCADE,
        related_name='contacts',
        verbose_name='Annonce'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_contacts',
        verbose_name='Expéditeur'
    )
    message = models.TextField(verbose_name='Message')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Téléphone')
    
    # Status
    is_read = models.BooleanField(default=False, verbose_name='Lu')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Contact'
        verbose_name_plural = 'Contacts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message de {self.sender.email} pour {self.ad.title}"
