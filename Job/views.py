from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics, status, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from rest_framework.response import Response

from JobPortal.asgi import application
from .models import *
from .serializers import *
from .permissions import *
from account.permissions import *


class JobCategoryListView(generics.ListAPIView):
    """
    API endpoint to list all job categories
    GET: List all categories with count
    """
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer
    permission_classes = [permissions.AllowAny]
    

class JobListView(generics.ListAPIView):
    """
    API endpoint to list all active jobs with filtering and search
    GET: List jobs with pagination, filters, and search
    
    Filters: category, job_type, location
    Search: title, description, company name
    Ordering: -created_at
    """
    serializer_class = JobListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'job_type', "location"]
    search_fields = ['title', 'description', 'employer__company_name','location']
    ordering_fields =['created_at', 'salary_min', 'deadline']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset =Job.objects.filter(is_active=True).select_related(
            'employer', 'category'
        )
        
        # Additional filters
        min_salary = self.request.query_params.get('min_salary')
        max_salary = self.request.query_params.get('max_salary')
        experience  = self.request.query_params.get('experience')
        
        if min_salary:
            queryset = queryset.filter(salary_min__gte=min_salary)
        if max_salary:
            queryset = queryset.filter(salary_max__lte=max_salary)
        if experience:
            queryset = queryset.filter(experience_required__lte=experience)
            
        return queryset
    
    
class JobDetailView(generics.RetrieveAPIView):
    """
        API endpoint to retrieve a single job detail
        GET: Retrieve job details and increment view count
    """
    queryset = Job.objects.filter(is_active=True)
    serializer_class = JobDetailSerializer
    permission_classes = [permissions.AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # increment view count
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
        
        
class EmployerJobListView(generics.ListAPIView):
    """
    API endpoint for employer to view their posted jobs
    GET: List all jobs posted by the authenticated employer
    """
    serializer_class = JobDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    
    def get_queryset(self):
        return Job.objects.filter(
            employer__user=self.request.user
        ).select_related('category').order_by('-created_at')
    

class JobCreateView(generics.CreateAPIView):
    """
    API endpoint for employer to create a new job
    POST: Create a new job posting
    """
    serializer_class = JobCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    
    def perform_create(self, serializer):
        employer_profile = self.request.user.employer_profile
        serializer.save(employer=employer_profile)
        
        
class JobUpdateView(generics.UpdateAPIView):
    """
    API endpoint for employer to update their job
    PUT/PATCH: Update job details
    """
    serializer_class = JobCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployerOwner]
    
    def get_queryset(self):
        return Job.objects.filter(employer__user=self.request.user)
    
    
class JobDeleteView(generics.DestroyAPIView):
    """
        API endpoint for employer to delete their job
        DELETE: Delete job posting
    """
    permission_classes = [permissions.IsAuthenticated, IsEmployerOwner]
    
    def get_queryset(self):
        return Job.objects.filter(employer__user=self.request.user)


class JobApplicationCreateView(generics.CreateAPIView):
    """
    API endpoint for job seeker to apply for a job
    POST: Submit job application
    """
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]
    
    def perform_create(self, serializer):
        applicant_profile = self.request.user.jobseeker_profile
        serializer.save(applicant=applicant_profile)
        

class EmployerApplicationListView(generics.ListAPIView):
    """
    API endpoint for employer to view applications for their jobs
    GET: List all applications received for employer's jobs
    """
    serializer_class = JobApplicationDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    
    def get_queryset(self):
        queryset = JobApplication.objects.filter(
            job__employer__user = self.request.user
        ).select_related('job', 'applicant', 'application__user')
        
        # Filter by specific job if provided
        job_id = self.request.query_params.get('job_id')
        if job_id:
            queryset = queryset.filter(job_id=job_id)
        return queryset.order_by('-applied')
    

class ApplicationStatusUpdateView(generics.UpdateAPIView):
    """
    API endpoint for employer to update application status
    PATCH: Update application status
    """
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    
    def get_queryset(self):
        return JobApplication.objects.filter(job__employer__user = self.request.user)
    
    def patch(self, request, pk):
        try:
            application = self.get_queryset().get(pk=pk)
        except JobApplication.DoesNotExist:
            return Response(
                {'error': 'Application not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        new_status = request.data.get('status')
        if new_status not in dict(JobApplication.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = new_status
        if new_status != 'pending':
            from django.utils import timezone
            application.reviewed_at = timezone.now()
        application.save()
        
        serializer = JobApplicationDetailSerializer(application)
        return Response(serializer.data)
    
    
class SavedJobListView(generics.ListAPIView):
    """
        API endpoint for job seeker to view saved jobs
        GET: List all saved jobs
    """
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]
    
    def get_queryset(self):
        return SavedJob.objects.filter(
            user=self.request.user
        ).select_related('job', 'job__employer', 'job__category')
    

class SaveJobView(APIView):
    """
        API endpoint to save/unsave a job
        POST: Save a job
        DELETE: Unsave a job
    """
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]
    
    def post(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id, is_active=True)
        except Job.DoesNotExist:
            return Response(
                {'error': 'job not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        saved_job, created = SavedJob.objects.get_or_create(
            user=request.user,
            job=job
        )
        
        if created:
            return Response(
                {'message':'Job saved successfully'},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {'message': 'Job already saved'},
                status=status.HTTP_200_OK
            )
        
    def delete(self,request, job_id):
        try:
            saved_job = SavedJob.objects.get(user=request.user, job_id=job_id)
            saved_job.delete()
            return Response(
                {'message': 'Job unsaved successfully'}
            )
        except SavedJob.DoesNotExist:
            return Response(
                {'error': 'Saved job not found'},
                status=status.HTTP_404_NOT_FOUND
            )