from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from .managers import UserManager
import random
import string


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model with email as unique identifier.
    """
    
    class Role(models.TextChoices):
        BUYER = 'acheteur', 'Acheteur'
        SELLER = 'vendeur', 'Vendeur'
        ADMIN = 'admin', 'Administrateur'
    
    email = models.EmailField(unique=True, verbose_name='Email')
    username = models.CharField(max_length=100, unique=True, verbose_name='Nom d\'utilisateur')
    first_name = models.CharField(max_length=100, verbose_name='Prénom')
    last_name = models.CharField(max_length=100, verbose_name='Nom')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Téléphone')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name='Photo de profil')
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.BUYER, verbose_name='Rôle')
    
    # Email confirmation
    is_email_verified = models.BooleanField(default=False, verbose_name='Email vérifié')
    email_verification_code = models.CharField(max_length=6, blank=True, null=True)
    email_verification_code_sent_at = models.DateTimeField(null=True, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    # Timestamps
    date_joined = models.DateTimeField(default=timezone.now, verbose_name='Date d\'inscription')
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-date_joined']
    
    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'
    
    def generate_verification_code(self):
        """Generate a 6-digit verification code with rate limiting."""
        now = timezone.now()
        
        # Rate limit: 1 minute between requests
        if self.email_verification_code_sent_at:
            time_diff = (now - self.email_verification_code_sent_at).total_seconds()
            if time_diff < 60:
                return None
        
        code = ''.join(random.choices(string.digits, k=6))
        self.email_verification_code = code
        self.email_verification_code_sent_at = now
        self.save(update_fields=['email_verification_code', 'email_verification_code_sent_at'])
        return code
    
    def verify_email(self, code):
        """Verify email with the provided code."""
        if self.email_verification_code == code:
            self.is_email_verified = True
            self.email_verification_code = None
            self.save(update_fields=['is_email_verified', 'email_verification_code'])
            return True
        return False
