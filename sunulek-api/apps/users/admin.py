from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'full_name', 'role', 'is_email_verified', 'is_active')
    list_filter = ('role', 'is_email_verified', 'is_active', 'is_staff')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Informations personnelles'), {
            'fields': ('username', 'first_name', 'last_name', 'phone', 'avatar')
        }),
        (_('Rôle et vérification'), {
            'fields': ('role', 'is_email_verified')
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        (_('Dates importantes'), {
            'fields': ('last_login', 'date_joined')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )
