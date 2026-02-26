from academics.models import Institutions, Programmes
from accounts.models import User
from django.db import models
from placements.models import InternshipPlacements


# Create your models here.
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
