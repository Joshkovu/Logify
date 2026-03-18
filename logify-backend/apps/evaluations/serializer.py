from django.db import models
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

    def validate(self, data):
        institution = data.get("institution")
        programme = data.get("programme")
        name = data.get("name")
        is_current = data.get("is_current", True)

        if institution and programme and name:
            exists = EvaluationRubrics.objects.filter(
                institution=institution, programme=programme, name=name
            ).exists()
            if exists:
                raise serializers.ValidationError(
                    "Rubric name must be unique for this institution and programme."
                )

        # Only one current rubric per institution/programme
        if institution and programme and is_current:
            current_count = EvaluationRubrics.objects.filter(
                institution=institution, programme=programme, is_current=True
            ).count()
            if current_count > 0:
                raise serializers.ValidationError(
                    "Only one current rubric allowed per institution and programme."
                )

        return data


class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = "__all__"

    def validate(self, data):
        rubric = data.get("rubric")
        name = data.get("name")
        weight_percent = data.get("weight_percent")

        evaluator_type = data.get("evaluator_type")

        # Unique name per rubric
        if rubric and name:
            exists = EvaluationCriteria.objects.filter(rubric=rubric, name=name).exists()
            if exists:
                raise serializers.ValidationError("Criterion name must be unique within a rubric.")

        # Weight validation: sum to 100% (only on create, not update)
        if rubric and weight_percent is not None:
            total_weight = (
                EvaluationCriteria.objects.filter(rubric=rubric).aggregate(
                    models.Sum("weight_percent")
                )["weight_percent__sum"]
                or 0
            )
            if total_weight + weight_percent > 100:
                raise serializers.ValidationError(
                    "Total criteria weights for this rubric cannot exceed 100%."
                )

        # Valid evaluator_type
        valid_types = ["student", "workplace_supervisor", "academic_supervisor", "internship_admin"]
        if evaluator_type and evaluator_type not in valid_types:
            raise serializers.ValidationError("Invalid evaluator_type.")

        return data


class EvaluationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluations
        fields = "__all__"


class EvaluationScoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationScores
        fields = "__all__"

    def validate(self, data):
        evaluation = data.get("evaluation")
        criterion = data.get("criterion")
        if evaluation and criterion:
            exists = EvaluationScores.objects.filter(
                evaluation=evaluation, criterion=criterion
            ).exists()
            if exists:
                raise serializers.ValidationError(
                    "Score for this criterion and evaluation already exists."
                )

            # Ensure only academic supervisor awards marks
            evaluator = evaluation.evaluator
            if not evaluator or evaluator.role != "academic_supervisor":
                raise serializers.ValidationError("Only the academic supervisor can award marks.")
        return data


class FinalResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalResults
        fields = "__all__"

    def validate(self, data):
        placement = data.get("placement")
        evaluator = None
        # Find academic supervisor for this placement
        if placement:
            evaluator = placement.academic_supervisor
        if not evaluator or evaluator.role != "academic_supervisor":
            raise serializers.ValidationError(
                "Only the academic supervisor can award final results."
            )
        return data
