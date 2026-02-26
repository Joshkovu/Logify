from accounts.models import User
from django.db import models
from placements.models import InternshipPlacements

# Create your models here.


# weekly_logs {
#     text id
#     text placement_id
#     integer week_number
#     integer week_start_date
#     integer week_end_date
#     text activities
#     text challenges
#     text learnings
#     text attachments_url
#     text status
#     integer submitted_at
#     integer created_at
#     integer updated_at
# }
class WeeklyLogs(models.Model):
    placement = models.ForeignKey(InternshipPlacements, on_delete=models.CASCADE)
    week_number = models.IntegerField()
    week_start_date = models.DateField()
    week_end_date = models.DateField()
    activities = models.TextField()
    challenges = models.TextField()
    learnings = models.TextField()
    attachments_url = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=255)
    submitted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Week {self.week_number} Log for {self.placement.internship_title}"


# weekly_log_status_history {
#     text id
#     text weekly_log_id
#     text from_status
#     text to_status
#     text changed_by_id
#     text comment
#     integer changed_at
# }


class WeeklyLogStatusHistory(models.Model):
    weekly_log = models.ForeignKey(WeeklyLogs, on_delete=models.CASCADE)
    from_status = models.CharField(max_length=255)
    to_status = models.CharField(max_length=255)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField(null=True, blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.weekly_log}: {self.from_status} -> {self.to_status}"


# supervisor_reviews {
#     text id
#     text weekly_log_id
#     text supervisor_id
#     text decision
#     text comment
#     integer reviewed_at
# }
class SupervisorReviews(models.Model):
    weekly_log = models.ForeignKey(WeeklyLogs, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(User, on_delete=models.CASCADE)
    decision = models.CharField(max_length=255)
    comment = models.TextField(null=True, blank=True)
    reviewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.supervisor.email} for {self.weekly_log}"


# evaluation_rubrics {
#     text id
#     text institution_id
#     text programme_id
#     text name
#     boolean is_active
#     integer created_at
# }
