from academics.models import Departments
from django.db import models

# Create your models here.


class User(models.Model):
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
    password_hash = models.CharField(max_length=255)
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
