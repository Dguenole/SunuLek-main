from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .models import Category
from .serializers import CategorySerializer


@extend_schema(tags=['Categories'])
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing categories."""
    
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    @action(detail=True, methods=['get'])
    def ads(self, request, slug=None):
        """Get all ads for a specific category."""
        category = self.get_object()
        from apps.annonces.serializers import AdListSerializer
        ads = category.ads.filter(is_active=True)
        serializer = AdListSerializer(ads, many=True, context={'request': request})
        return Response(serializer.data)
