from apps.accounts.models import User
from django.db import models

# Create your models here.


class InternshipReport(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)  # type: ignore
    internship_start = models.DateField()
    internship_end = models.DateField()
    logs = models.TextField()
    supervisor_comments = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
