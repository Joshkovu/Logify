from django.contrib import admin

from .models import (
    EvaluationCriteria,
    EvaluationRubrics,
    Evaluations,
    EvaluationScores,
    FinalResults,
)

# Register your models here.
admin.site.register(EvaluationRubrics)
admin.site.register(EvaluationCriteria)
admin.site.register(Evaluations)
admin.site.register(EvaluationScores)
admin.site.register(FinalResults)
