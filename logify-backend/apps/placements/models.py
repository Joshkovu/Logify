from apps.academics.models import Institutions, Programmes
from apps.accounts.models import User
from apps.organizations.models import Organizations
from django.db import models

# Create your models here.
# internship_placements {
#     text id
#     text intern_id
#     text institution_id
#     text programme_id
#     text organization_id
#     text workplace_supervisor_user_id
#     text academic_supervisor_user_id
#     integer start_date
#     integer end_date
#     text work_mode
#     text internship_title
#     text department_at_company
#     text status
#     integer submitted_at
#     integer approved_at
#     integer created_at
#     integer updated_at
# }


class InternshipPlacements(models.Model):
    intern = models.ForeignKey(User, on_delete=models.CASCADE)
    institution = models.ForeignKey(Institutions, on_delete=models.CASCADE)
    programme = models.ForeignKey(Programmes, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organizations, on_delete=models.CASCADE)
    workplace_supervisor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="workplace_supervisor"
    )
    academic_supervisor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="academic_supervisor"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    work_mode = models.CharField(max_length=255)
    internship_title = models.CharField(max_length=255)
    department_at_company = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    submitted_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.internship_title


# placement_status_history {
#     text id
#     text placement_id
#     text from_status
#     text to_status
#     text changed_by_id
#     text comment
#     integer changed_at
# }


class PlacementStatusHistory(models.Model):
    placement = models.ForeignKey(InternshipPlacements, on_delete=models.CASCADE)
    from_status = models.CharField(max_length=255)
    to_status = models.CharField(max_length=255)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField(null=True, blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.placement.internship_title}: {self.from_status} -> {self.to_status}"


# placement_contacts {
#     text id
#     text placement_id
#     text full_name
#     text email
#     text phone
#     text title
#     boolean is_primary
# }


class PlacementContacts(models.Model):
    placement = models.ForeignKey(InternshipPlacements, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    title = models.CharField(max_length=255)
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.full_name} ({'Primary' if self.is_primary else 'Secondary'})"
