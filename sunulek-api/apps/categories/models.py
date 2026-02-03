from django.db import models


class Category(models.Model):
    """Category for ads."""
    
    name = models.CharField(max_length=100, unique=True, verbose_name='Nom')
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, verbose_name='Description')
    icon = models.CharField(max_length=50, blank=True, verbose_name='Icône')  # For frontend icon class
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name='Active')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordre')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name
