from django.urls import path
from .views import *

app_name = 'jobs'

urlpatterns = [
    # Job Category
    path('categories/', JobCategoryListView.as_view(), name='category-list'),
    
    # Job Listing
    path('', JobListView.as_view(), name='job-list'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    
    #Employer Job Management
    path('employer/jobs/', EmployerJobListView.as_view(), name='employer-job-list'),
    path('employer/jobs/create/', JobCreateView.as_view(), name='job-create'),
    path('employer/jobs/<int:pk>/update/', JobUpdateView.as_view(), name='job-update'),
    path('employer/jobs/<int:pk>/delete/', JobDeleteView.as_view(), name='job-delete'),
    
    # Job Application
    path('applications/apply/', JobApplicationCreateView.as_view(), name='apply-job'),
    path('applications/my-application/', JobSeekerApplicationListView.as_view(), name='my-applications'),
    path('employer/applications/', EmployerApplicationListView.as_view(), name='employer-applications'),
    path('employer/application/<int:pk>/status/', ApplicationStatusUpdateView.as_view(), name='update-application-status'),
    
    # Saved Jobs
    path('saved//', SavedJobListView.as_view(), name='saved-jobs'),
    path('saved/<int:job_id>/', SaveJobView.as_view(), name='save-job')
]