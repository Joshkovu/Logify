from rest_framework import permissions

from .models import User


class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.STUDENT


class IsAcademicSupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.ACADEMIC_SUPERVISOR


class IsWorkplaceSupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.WORKPLACE_SUPERVISOR


class IsInternshipAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.INTERNSHIP_ADMIN


class IsAnySupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            User.ACADEMIC_SUPERVISOR,
            User.WORKPLACE_SUPERVISOR,
        ]


class IsAnySupervisorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role in [User.ACADEMIC_SUPERVISOR, User.WORKPLACE_SUPERVISOR]
            or request.user.role == User.INTERNSHIP_ADMIN
            or request.user.is_superuser
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    Assumes the model instance has a `user` attribute.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.role == User.INTERNSHIP_ADMIN:
            return True
        return obj.user == request.user
