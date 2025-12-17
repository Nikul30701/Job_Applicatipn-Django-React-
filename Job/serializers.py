from rest_framework import serializers
from .models import Job, JobCategory, JobApplication, SavedJob
from account.serializers import EmployerProfileSerializer, JobSeekerProfileSerializer


class JobCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for Job Categories
    """
    jobs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = JobCategory
        fields = ['id', 'name', 'slug', 'description', 'jobs_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_jobs_count(self, obj):
        return obj.jobs.filter(is_active=True).count()


class JobListSerializer(serializers.ModelSerializer):
    """
    Serializer for Job List (lightweight, for listing pages)
    """
    employer_name = serializers.CharField(source='employer.company_name', read_only=True)
    employer_logo = serializers.ImageField(source='employer.logo', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_saved = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'employer_name', 'employer_logo',
            'category_name', 'location', 'job_type',
            'salary_min', 'salary_max', 'experience_required',
            'is_active', 'deadline', 'created_at',
            'applications_count', 'is_saved', 'has_applied'
        ]
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.user_type == 'job_seeker':
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False
    
    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.user_type == 'job_seeker':
            if hasattr(request.user, 'jobseeker_profile'):
                return JobApplication.objects.filter(
                    job=obj,
                    applicant=request.user.jobseeker_profile
                ).exists()
        return False


class JobDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for Job Detail (complete information)
    """
    employer = EmployerProfileSerializer(read_only=True)
    category = JobCategorySerializer(read_only=True)
    is_saved = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['id', 'employer', 'created_at', 'updated_at', 'views_count']
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.user_type == 'job_seeker':
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False
    
    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.user_type == 'job_seeker':
            if hasattr(request.user, 'jobseeker_profile'):
                return JobApplication.objects.filter(
                    job=obj,
                    applicant=request.user.jobseeker_profile
                ).exists()
        return False


class JobCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating jobs (by employers)
    """
    
    class Meta:
        model = Job
        fields = [
            'category', 'title', 'description', 'requirements',
            'location', 'job_type', 'salary_min', 'salary_max',
            'experience_required', 'skills_required', 'deadline'
        ]
    
    def validate_deadline(self, value):
        from django.utils import timezone
        if value and value < timezone.now().date():
            raise serializers.ValidationError("Deadline cannot be in the past")
        return value
    
    def validate(self, attrs):
        salary_min = attrs.get('salary_min')
        salary_max = attrs.get('salary_max')
        
        if salary_min and salary_max and salary_min > salary_max:
            raise serializers.ValidationError({
                "salary_max": "Maximum salary must be greater than minimum salary"
            })
        return attrs


class JobApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer for Job Applications
    """
    job_title = serializers.CharField(source='job.title', read_only=True)
    applicant_name = serializers.CharField(source='applicant.full_name', read_only=True)
    applicant_email = serializers.EmailField(source='applicant.user.email', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'applicant', 'applicant_name',
            'applicant_email', 'cover_letter', 'status',
            'applied_at', 'reviewed_at'
        ]
        read_only_fields = ['id', 'applicant', 'applied_at', 'reviewed_at']
    
    def validate_job(self, value):
        request = self.context.get('request')
        
        # Check if job is active
        if not value.is_active:
            raise serializers.ValidationError("This job is no longer accepting applications")
        
        # Check deadline
        if value.is_deadline_passed:
            raise serializers.ValidationError("Application deadline has passed")
        
        # Check if already applied
        if request and hasattr(request.user, 'jobseeker_profile'):
            if JobApplication.objects.filter(
                    job=value,
                    applicant=request.user.jobseeker_profile
            ).exists():
                raise serializers.ValidationError("You have already applied for this job")
        
        return value


class JobApplicationDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for job applications (for employers to view)
    """
    job = JobListSerializer(read_only=True)
    applicant = JobSeekerProfileSerializer(read_only=True)
    
    class Meta:
        model = JobApplication
        fields = '__all__'


class SavedJobSerializer(serializers.ModelSerializer):
    """
    Serializer for Saved Jobs
    """
    job = JobListSerializer(read_only=True)
    
    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'saved_at']
        read_only_fields = ['id', 'saved_at']