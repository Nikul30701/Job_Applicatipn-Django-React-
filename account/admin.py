from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'user_type', 'is_active', 'is_staff', 'date_joined']
    list_filter = ['user_type', 'is_active', 'is_staff']
    search_fields = ['email']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('user_type',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'user_type', 'password1', 'password2'),
        }),
    )


@admin.register(Employer)
class EmployerProfileAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'user', 'location', 'create_at']
    search_fields = ['company_name', 'user__email']
    list_filter = ['create_at']


@admin.register(JobSeeker)
class JobSeekerProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'user', 'phone', 'experience_years', 'create_at']
    search_fields = ['full_name', 'user__email', 'phone']
    list_filter = ['experience_years', 'create_at']

