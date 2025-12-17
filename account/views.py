from django.shortcuts import render
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import *
from .models import *
from .permissions import *

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration
    POST: Register new user (employer or job seeker)
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user':UserSerializer(user).data,
            'token':{
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
    

class ProfileView(APIView):
    """
    API endpoint to get and update user profile
    GET: Retrieve current user's profile
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)
    

class EmployerProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for employer profile
    GET: Retrieve employer profile
    PUT/PATCH: Update employer profile
    """
    serializer_class = EmployerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    
    def get_object(self):
        profile, created = Employer. objects.get_or_create(user=self.request.user)
        return profile


class JobSeekerProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for employer profile
    GET: Retrieve employer profile
    PUT/PATCH: Update employer profile
    """
    serializer_class = JobSeekerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    
    def get_object(self):
        profile, created = JobSeeker.objects.get_or_create(user=self.request.user)
        return profile
 
    