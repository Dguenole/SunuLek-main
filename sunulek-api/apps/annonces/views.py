from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Ad, AdImage, AdContact
from .serializers import (
    AdListSerializer,
    AdDetailSerializer,
    AdCreateSerializer,
    AdContactSerializer,
    AdImageSerializer,
)
from .filters import AdFilter
from .permissions import IsOwnerOrReadOnly


@extend_schema(tags=['Annonces'])
@extend_schema_view(
    list=extend_schema(description='Liste de toutes les annonces actives'),
    retrieve=extend_schema(description='Détails d\'une annonce'),
    create=extend_schema(description='Créer une nouvelle annonce'),
    update=extend_schema(description='Modifier une annonce'),
    destroy=extend_schema(description='Supprimer une annonce'),
)
class AdViewSet(viewsets.ModelViewSet):
    """ViewSet for ads/annonces."""
    
    queryset = Ad.objects.filter(is_active=True, status='active')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = AdFilter
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at', 'views_count']
    ordering = ['-created_at']
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        return [permissions.AllowAny()]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AdListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return AdCreateSerializer
        return AdDetailSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count (simple implementation)
        if not request.user.is_authenticated or request.user != instance.user:
            instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_ads(self, request):
        """Get current user's ads."""
        ads = Ad.objects.filter(user=request.user, is_active=True)
        serializer = AdListSerializer(ads, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def contact(self, request, slug=None):
        """Send a contact message to ad owner."""
        ad = self.get_object()
        
        # Prevent self-contact
        if ad.user == request.user:
            return Response(
                {'error': 'Vous ne pouvez pas vous contacter vous-même.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = AdContactSerializer(data={**request.data, 'ad': ad.id}, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({'message': 'Message envoyé avec succès.'}, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_images(self, request, slug=None):
        """Add images to an existing ad."""
        ad = self.get_object()
        
        if ad.user != request.user:
            return Response(
                {'error': 'Vous n\'êtes pas le propriétaire de cette annonce.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        images = request.FILES.getlist('images')
        if not images:
            return Response(
                {'error': 'Aucune image fournie.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        existing_count = ad.images.count()
        for i, image in enumerate(images):
            AdImage.objects.create(
                ad=ad,
                image=image,
                is_primary=(existing_count == 0 and i == 0),
                order=existing_count + i
            )
        
        return Response({'message': f'{len(images)} image(s) ajoutée(s).'})
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured ads."""
        ads = self.get_queryset().filter(is_featured=True)[:10]
        serializer = AdListSerializer(ads, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get most recent ads."""
        ads = self.get_queryset().order_by('-created_at')[:10]
        serializer = AdListSerializer(ads, many=True, context={'request': request})
        return Response(serializer.data)


@extend_schema(tags=['Messages'])
class ContactMessagesViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing contact messages received."""
    
    serializer_class = AdContactSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Get messages for ads owned by current user
        return AdContact.objects.filter(ad__user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a message as read."""
        message = self.get_object()
        message.is_read = True
        message.save(update_fields=['is_read'])
        return Response({'message': 'Marqué comme lu.'})
