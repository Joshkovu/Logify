from apps.accounts.models import User
from django.db import models

# Create your models here.


class InternshipReport(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)  # type: ignore
    internship_start = models.DateField()
    internship_end = models.DateField()
    logs = models.TextField()
    supervisor_comments = models.TextField(blank=True, null=True)
    REPORT_TYPE_CHOICES = [
        ("mid-term", "Mid-Term"),
        ("final", "Final"),
        ("summary", "Summary"),
        ("evaluation", "Evaluation"),
    ]
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES, default="summary")
    evaluation_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    placement_info = models.TextField(blank=True, null=True)
    summary_stats = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
