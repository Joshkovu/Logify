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


#  text id
#     text name
#     text short_name
#     text email_domain
#     boolean is_active
#     integer created_at
class Institutions(models.Model):
    name = models.CharField(max_length=255)
    email_domain = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# text id
#     text institution_id
#     text name
#     integer created_at


class Departments(models.Model):
    institution = models.ForeignKey(Institutions, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# programmes {
#     text id
#     text department_id
#     text name
#     text level
#     integer duration_years
#     integer created_at
# }


class Programmes(models.Model):
    department = models.ForeignKey(Departments, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    level = models.CharField(max_length=255)
    duration_years = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


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


class StaffProfiles(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    staff_number = models.CharField(max_length=255)
    department = models.ForeignKey(Departments, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.staff_number


# organizations {
#     text id
#     text name
#     text industry
#     text country
#     text city
#     text address
#     text contact_email
#     text contact_phone
#     integer created_at
# }


class Organizations(models.Model):
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=255)

    city = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)

    def __str__(self):
        return self.name


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


class EvaluationRubrics(models.Model):
    institution = models.ForeignKey(Institutions, on_delete=models.CASCADE)
    programme = models.ForeignKey(Programmes, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# evaluation_criteria {
#     text id
#     text rubric_id
#     text name
#     text description
#     integer max_score
#     float weight_percent
#     text evaluator_type
#     integer created_at
# }


class EvaluationCriteria(models.Model):
    rubric = models.ForeignKey(EvaluationRubrics, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    max_score = models.IntegerField()
    weight_percent = models.FloatField()
    evaluator_type = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# evaluations {
#     text id
#     text placement_id
#     text rubric_id
#     text evaluator_id
#     text evaluator_type
#     text status
#     integer submitted_at
#     float total_score
#     integer created_at
# }


class Evaluations(models.Model):
    placement = models.ForeignKey(InternshipPlacements, on_delete=models.CASCADE)
    rubric = models.ForeignKey(EvaluationRubrics, on_delete=models.CASCADE)
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE)
    evaluator_type = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    submitted_at = models.DateTimeField(null=True, blank=True)
    total_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluation by {self.evaluator.email} " f"for {self.placement.internship_title}"


# evaluation_scores {
#     text id
#     text evaluation_id
#     text criterion_id
#     float score
#     text comment
# }
class EvaluationScores(models.Model):
    evaluation = models.ForeignKey(Evaluations, on_delete=models.CASCADE)
    criterion = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.FloatField()
    comment = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Score for {self.criterion.name} in {self.evaluation}"


# final_results {
#     text id
#     text placement_id
#     float logbook_score
#     float workplace_score
#     float academic_score
#     float final_score
#     text final_grade
#     integer computed_at
# }


class FinalResults(models.Model):
    placement = models.ForeignKey(InternshipPlacements, on_delete=models.CASCADE)
    logbook_score = models.FloatField()
    workplace_score = models.FloatField()
    academic_score = models.FloatField()
    final_score = models.FloatField()
    final_grade = models.CharField(max_length=255)
    computed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Final Result for {self.placement.internship_title}"
