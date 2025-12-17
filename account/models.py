from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.conf import settings

User = settings.AUTH_USER_MODEL

class UserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier
    instead of username.
    """

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser,PermissionsMixin):
    """
    Custom User model with email as username field.
    Supports two user types: Job Seeker and Employer
    """

    USER_TYPE_CHOICES = (
        ('job_seeker', 'Job Seeker'),
        ('employer', 'Employer'),
    )

    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='job_seeker')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['user_type']

    class Meta:
        db_table = 'users'
        verbose_name = "User"
        verbose_name_plural = "Users"


    def __str__(self):
        return f"{self.email} ({self.get_user_type_display()})"

    

class Employer(models.Model):
    """
    Profile for Employer users containing company information
    """
    user = models.OneToOneField(User,
        on_delete=models.CASCADE,
        related_name='employer_profile',
        limit_choices_to={'user_type': 'employer'}
    )
    company_name = models.CharField(max_length=100)
    company_website = models.URLField(blank=True, null=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employer_profile'
        verbose_name = "Employer Profile"
        verbose_name_plural = "Employer Profiles"
    
    def __str__(self):
        return self.company_name


class JobSeeker(models.Model):
    """
    Profile for Job Seeker users containing personal information
    """
    user = models.OneToOneField(User,
        on_delete=models.CASCADE,
        related_name='jobseeker_profile',
        limit_choices_to={'user_type': 'job_seeker'}
    )
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    skills = models.TextField(help_text="Comma separated list of skills", blank=True, null=True)
    experience_years = models.PositiveIntegerField(blank=True, null=True)
    education = models.TextField(blank=True, null=True)   
    bio = models.TextField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'jobseeker_profile'
        verbose_name = "Job Seeker Profile"
        verbose_name_plural = "Job Seeker Profiles"
    
    def __str__(self):
        return f"{self.full_name}"
