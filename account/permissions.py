from rest_framework import permissions


class IsEmployer(permissions.BasePermission):
    """
    Permission to only allow employers to access certain views
    """
    message = "Only employer can perform this action"
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.user_type == 'employer'
        )
    
    
class IsJobSeeker(permissions.BasePermission):
    """
    Permisson to only allow job seeker to access certain view
    """
    message = "Only job seekers can perform this action"
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.user_type == 'job_seeker'
        )
    

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj.user == request.user