from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .models import Favorite
from .serializers import FavoriteSerializer


@extend_schema(tags=['Favoris'])
class FavoriteViewSet(viewsets.ModelViewSet):
    """ViewSet for managing favorites."""
    
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'Retiré des favoris.'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Toggle favorite status for an ad."""
        ad_id = request.data.get('ad_id')
        
        if not ad_id:
            return Response(
                {'error': 'ad_id est requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from apps.annonces.models import Ad
            ad = Ad.objects.get(id=ad_id, is_active=True)
        except Exception:
            return Response(
                {'error': 'Annonce non trouvée.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        favorite, created = Favorite.objects.get_or_create(user=request.user, ad=ad)
        
        if not created:
            favorite.delete()
            return Response({
                'is_favorited': False,
                'message': 'Retiré des favoris.'
            })
        
        return Response({
            'is_favorited': True,
            'message': 'Ajouté aux favoris.'
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def count(self, request):
        """Get count of user's favorites."""
        count = self.get_queryset().count()
        return Response({'count': count})
