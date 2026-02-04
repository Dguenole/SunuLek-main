from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    VerifyEmailView,
    ResendVerificationView,
    ProfileView,
    ChangePasswordView,
    LogoutView,
    PublicProfileView,
)

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Email verification
    path('verify-email/<int:user_id>/', VerifyEmailView.as_view(), name='verify_email'),
    path('resend-verification/', ResendVerificationView.as_view(), name='resend_verification'),
    
    # Profile
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/<int:id>/', PublicProfileView.as_view(), name='public_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
]
