from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdViewSet, ContactMessagesViewSet

router = DefaultRouter()
router.register('', AdViewSet, basename='ad')

urlpatterns = [
    path('messages/', ContactMessagesViewSet.as_view({'get': 'list'}), name='messages-list'),
    path('messages/<int:pk>/', ContactMessagesViewSet.as_view({'get': 'retrieve'}), name='messages-detail'),
    path('messages/<int:pk>/mark-read/', ContactMessagesViewSet.as_view({'post': 'mark_read'}), name='messages-mark-read'),
    path('', include(router.urls)),
]
