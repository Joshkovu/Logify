from rest_framework import serializers

from .models import (
    EvaluationCriteria,
    EvaluationRubrics,
    Evaluations,
    EvaluationScores,
    FinalResults,
)


class EvaluationRubricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationRubrics
        fields = "__all__"


class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = "__all__"


class EvaluationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluations
        fields = "__all__"


class EvaluationScoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationScores
        fields = "__all__"


class FinalResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalResults
        fields = "__all__"
