from rest_framework import permissions

class IsEmployerOwner(permissions.BasePermission):
    """
    Permission to only allow employer owner to edit their jobs
    """
    message = "You can only edit your own job settings"
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.user_type == 'employer'
        )
    
    def has_object_permission(self, request, view, obj):
        return obj.employer.user == request.user
    