from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import EmployerProfile, JobSeekerProfile

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'user_type']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords don't match"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class EmployerProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Employer Profile
    """
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = EmployerProfile
        fields = [
            'id', 'email', 'company_name', 'company_website',
            'description', 'logo', 'location', 'contact_phone',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class JobSeekerProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Job Seeker Profile
    """
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = JobSeekerProfile
        fields = [
            'id', 'email', 'full_name', 'phone', 'resume',
            'profile_picture', 'skills', 'experience_years',
            'education', 'bio', 'linkedin_url', 'github_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User with nested profile data
    """
    profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'user_type', 'is_active', 'date_joined', 'profile']
        read_only_fields = ['id', 'date_joined']
    
    def get_profile(self, obj):
        if obj.user_type == 'employer':
            if hasattr(obj, 'employer_profile'):
                return EmployerProfileSerializer(obj.employer_profile).data
        elif obj.user_type == 'job_seeker':
            if hasattr(obj, 'jobseeker_profile'):
                return JobSeekerProfileSerializer(obj.jobseeker_profile).data
        return None