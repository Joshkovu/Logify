from apps.academics.models import Departments
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.utils import timezone

# Create your models here.


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    STUDENT = "student"
    WORKPLACE_SUPERVISOR = "workplace_supervisor"
    ACADEMIC_SUPERVISOR = "academic_supervisor"
    INTERNSHIP_ADMIN = "internship_admin"

    ROLE_CHOICES = [
        (STUDENT, "Student"),
        (WORKPLACE_SUPERVISOR, "Workplace Supervisor"),
        (ACADEMIC_SUPERVISOR, "Academic Supervisor"),
        (INTERNSHIP_ADMIN, "Internship Administrator"),
    ]

    email = models.EmailField(unique=True)
    last_login = models.DateTimeField(null=True, blank=True, default=timezone.now)
    password_hash = models.CharField(max_length=255, blank=True, default="")
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    role = models.CharField(max_length=32, choices=ROLE_CHOICES)
    institution_id = models.CharField(max_length=255, null=True, blank=True)
    programme_id = models.CharField(max_length=255, null=True, blank=True)
    student_registry_id = models.CharField(max_length=255, null=True, blank=True)
    student_number = models.IntegerField(null=True, blank=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects: "UserManager" = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "role"]

    def __str__(self):
        return self.email


class StaffProfiles(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    staff_number = models.CharField(max_length=255)
    department = models.ForeignKey(Departments, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.staff_number


class SupervisorApplication(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="supervisor_application"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.status}"
