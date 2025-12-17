from django.db import models
from django.db.models.fields import PositiveIntegerField
from django.utils import timezone

from account.models import Employer,User,JobSeeker


class JobCategory(models.Model):
    """
    Job Category for classification of jobs
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'job_category'
        verbose_name = "Job Category"
        verbose_name_plural = "Job Categories"

    def __str__(self):
        return self.name


class Job(models.Model):
    JOB_TYPE_CHOICES = (
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('remote', 'Remote'),
    )
    employer = models.ForeignKey(
        Employer,
        on_delete=models.CASCADE,
        related_name='jobs'
    )
    category = models.ForeignKey(
        JobCategory,
        on_delete= models.CASCADE,
        related_name='jobs',
        null=True
    )
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField(null=True, blank=True)
    requirements = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    job_type = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES)
    salary_min = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    experience_required = models.PositiveIntegerField(help_text='Years of experience', default=0)
    skills_required = models.TextField(help_text="Comma-separated skills", blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models,PositiveIntegerField(default=0)
    
    class Meta:
        db_table = 'jobs'
        verbose_name='Job'
        verbose_name_plural = 'Jobs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at', 'is_active']),
            models.Index(fields=['employer', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.employer.company_name}"
    
    @property
    def is_deadline_passes(self):
        if self.deadline:
            return timezone.now().date() >  self.deadline
        return False
    
    @property
    def application_count(self):
        return self.application_count()


class JobApplication(models.Model):
    """
    Job applications submitted by job seekers
    """
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('accepted', 'Accepted'),
    )
    
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    applicant = models.ForeignKey(
        JobSeeker,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'job_applications'
        verbose_name = 'Job Application'
        verbose_name_plural = 'Job Applications'
        ordering = ['-applied_at']
        unique_together = ['job', 'applicant']  # One application per job per user
        indexes = [
            models.Index(fields=['job', 'status']),
            models.Index(fields=['applicant', '-applied_at']),
        ]
    
    def __str__(self):
        return f"{self.applicant.full_name} - {self.job.title}"


class SavedJob(models.Model):
    """
    Jobs saved/bookmarked by job seekers
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='saved_jobs',
        limit_choices_to={'user_type': 'job_seeker'}
    )
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='saved_by'
    )
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'saved_jobs'
        verbose_name = 'Saved Job'
        verbose_name_plural = 'Saved Jobs'
        ordering = ['-saved_at']
        unique_together = ['user', 'job']  # User can save a job only once
    
    def __str__(self):
        return f"{self.user.email} saved {self.job.title}"