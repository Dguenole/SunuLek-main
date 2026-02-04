from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from drf_spectacular.utils import extend_schema, extend_schema_view

from .serializers import (
    UserSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    VerifyEmailSerializer,
    ResendVerificationSerializer,
    ChangePasswordSerializer,
    UpdateProfileSerializer,
    PublicProfileSerializer,
)

User = get_user_model()


@extend_schema(tags=['Authentication'])
class RegisterView(generics.CreateAPIView):
    """Register a new user."""
    
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate and send verification code
        code = user.generate_verification_code()
        if code:
            send_mail(
                subject='SunuLek - Code de confirmation',
                message=f'Bonjour {user.first_name},\n\nVotre code de confirmation est : {code}\n\nCe code expire dans 10 minutes.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )
        
        return Response({
            'message': 'Inscription réussie. Un code de confirmation a été envoyé à votre email.',
            'user_id': user.id,
            'email': user.email,
        }, status=status.HTTP_201_CREATED)


@extend_schema(tags=['Authentication'])
class CustomTokenObtainPairView(TokenObtainPairView):
    """Login with email and password, get JWT tokens."""
    
    serializer_class = CustomTokenObtainPairSerializer


@extend_schema(tags=['Authentication'])
class VerifyEmailView(APIView):
    """Verify user email with code."""
    
    permission_classes = [permissions.AllowAny]
    serializer_class = VerifyEmailSerializer
    
    def post(self, request, user_id):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur non trouvé.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if user.verify_email(serializer.validated_data['code']):
            return Response({'message': 'Email vérifié avec succès.'})
        
        return Response(
            {'error': 'Code invalide.'},
            status=status.HTTP_400_BAD_REQUEST
        )


@extend_schema(tags=['Authentication'])
class ResendVerificationView(APIView):
    """Resend email verification code."""
    
    permission_classes = [permissions.AllowAny]
    serializer_class = ResendVerificationSerializer
    
    def post(self, request):
        serializer = ResendVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = User.objects.get(email=serializer.validated_data['email'])
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur non trouvé.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if user.is_email_verified:
            return Response(
                {'message': 'Email déjà vérifié.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        code = user.generate_verification_code()
        if code:
            send_mail(
                subject='SunuLek - Nouveau code de confirmation',
                message=f'Bonjour {user.first_name},\n\nVotre nouveau code est : {code}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )
            return Response({'message': 'Nouveau code envoyé.'})
        
        return Response(
            {'error': 'Veuillez attendre 1 minute avant de redemander un code.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )


@extend_schema(tags=['User Profile'])
class ProfileView(generics.RetrieveUpdateAPIView):
    """Get or update current user profile."""
    
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UpdateProfileSerializer
        return UserSerializer


@extend_schema(tags=['User Profile'])
class ChangePasswordView(APIView):
    """Change user password."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChangePasswordSerializer
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'Ancien mot de passe incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({'message': 'Mot de passe modifié avec succès.'})


@extend_schema(tags=['Authentication'])
class LogoutView(APIView):
    """Logout user by blacklisting refresh token."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Déconnexion réussie.'})
        except Exception:
            return Response(
                {'error': 'Token invalide.'},
                status=status.HTTP_400_BAD_REQUEST
            )


@extend_schema(tags=['User Profile'])
class PublicProfileView(generics.RetrieveAPIView):
    """Get public profile of a user by ID."""
    
    serializer_class = PublicProfileSerializer
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    lookup_field = 'id'
