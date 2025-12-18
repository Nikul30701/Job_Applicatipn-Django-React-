from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

app_name = 'account'

urlpatterns = [
    #Authentication endpoint
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    
#     Profile endpoint
    path('profile', ProfileView.as_view(), name='profile'),
    path('profile/employer/', EmployerProfileView.as_view(), name='employer-profile'),
    path('profile/jobseeker/', JobSeekerProfileView.as_view(), name='jobseeker-profile'),
]