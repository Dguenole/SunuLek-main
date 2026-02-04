from django.urls import path
from .views import ConversationViewSet

urlpatterns = [
    path('', ConversationViewSet.as_view({'get': 'list'}), name='conversation-list'),
    path('start/', ConversationViewSet.as_view({'post': 'start'}), name='conversation-start'),
    path('unread-count/', ConversationViewSet.as_view({'get': 'unread_count'}), name='unread-count'),
    path('<int:pk>/', ConversationViewSet.as_view({'get': 'retrieve'}), name='conversation-detail'),
    path('<int:pk>/send/', ConversationViewSet.as_view({'post': 'send'}), name='conversation-send'),
]
