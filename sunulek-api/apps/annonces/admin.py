from django.contrib import admin
from .models import Ad, AdImage, AdContact


class AdImageInline(admin.TabularInline):
    model = AdImage
    extra = 1


@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'price', 'status', 'is_featured', 'views_count', 'created_at')
    list_filter = ('status', 'is_active', 'is_featured', 'category', 'region')
    search_fields = ('title', 'description', 'user__email')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('views_count', 'created_at', 'updated_at')
    inlines = [AdImageInline]
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'slug', 'description', 'price', 'is_negotiable')
        }),
        ('Relations', {
            'fields': ('user', 'category')
        }),
        ('Localisation', {
            'fields': ('region', 'department', 'neighborhood', 'address')
        }),
        ('Statut', {
            'fields': ('status', 'is_active', 'is_featured')
        }),
        ('Statistiques', {
            'fields': ('views_count', 'created_at', 'updated_at', 'published_at', 'expires_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(AdContact)
class AdContactAdmin(admin.ModelAdmin):
    list_display = ('ad', 'sender', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('ad__title', 'sender__email', 'message')
