from apps.academics.models import Institutions, Programmes
from django.db import models

# Create your models here.

# student_registry {
#     text id
#     text institution_id
#     text programme_id
#     integer student_number
#     text webmail
#     integer year_of_study
#     integer intake_year
#     text status
#     boolean is_claimed
#     integer claimed_at
#     integer created_at
# }


class StudentRegistry(models.Model):
    institution = models.ForeignKey(Institutions, on_delete=models.CASCADE)
    programme = models.ForeignKey(Programmes, on_delete=models.CASCADE)
    student_number = models.IntegerField()
    webmail = models.EmailField()
    year_of_study = models.IntegerField()
    intake_year = models.IntegerField()
    status = models.CharField(max_length=255)
    is_claimed = models.BooleanField(default=False)
    claimed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.webmail


# registration_attempts {
#     text id
#     text institution_id
#     text webmail
#     integer student_number
#     text status
#     text otp_hash
#     integer expires_at
#     integer created_at
# }


class RegistrationAttempts(models.Model):
    institution = models.ForeignKey(Institutions, on_delete=models.CASCADE)
    webmail = models.EmailField()
    student_number = models.IntegerField()
    status = models.CharField(max_length=255)
    otp_hash = models.CharField(max_length=255)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.webmail


# staff_profiles {
#     text id
#     text user_id
#     text staff_number
#     text department_id
#     text title
#     integer created_at
# }
