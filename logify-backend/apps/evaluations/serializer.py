from apps.evaluations.models import (
    EvaluationCriteria,
    EvaluationRubrics,
    Evaluations,
    EvaluationScores,
    FinalResults,
)
from django.db import models
from rest_framework import serializers


class EvaluationRubricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationRubrics
        fields = "__all__"

    def validate(self, data):
        instance = getattr(self, "instance", None)
        institution = data.get("institution") or getattr(instance, "institution", None)
        programme = data.get("programme") or getattr(instance, "programme", None)
        name = data.get("name") or getattr(instance, "name", None)
        if "is_current" in data:
            is_current = data["is_current"]
        else:
            if instance is not None:
                is_current = getattr(instance, "is_current", None)
            else:
                is_current = True

        if institution and programme and name:
            qs = EvaluationRubrics.objects.filter(
                institution=institution,
                programme=programme,
                name=name,
                is_current=is_current,
            )
            if instance is not None:
                qs = qs.exclude(pk=instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    "Rubric name must be unique for this institution and programme."
                )

            # Only one current rubric per institution/programme
            qs_current = EvaluationRubrics.objects.filter(
                institution=institution,
                programme=programme,
                is_current=True,
            )
            if instance is not None:
                qs_current = qs_current.exclude(pk=instance.pk)
                current_count = qs_current.count()
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
        instance = getattr(self, "instance", None)
        rubric = data.get("rubric") or getattr(instance, "rubric", None)
        name = data.get("name") or getattr(instance, "name", None)
        weight_percent = data.get("weight_percent")

        evaluator_type = data.get("evaluator_type") or getattr(instance, "evaluator_type", None)

        if rubric and name:
            criteria_qs = EvaluationCriteria.objects.filter(rubric=rubric, name=name)

            if self.instance is not None:
                criteria_qs = criteria_qs.exclude(pk=self.instance.pk)
                exists = criteria_qs.exists()
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
            request = self.context.get("request") if hasattr(self, "context") else None
            if request is not None and hasattr(request, "user"):
                if evaluator != request.user and evaluator.role != "academic_supervisor":
                    raise serializers.ValidationError(
                        "Only the academic supervisor can award marks for this criterion."
                    )
            else:
                if evaluator.role != "academic_supervisor":
                    raise serializers.ValidationError(
                        "Only the academic supervisor can award marks for this criterion."
                    )
        return data


class FinalResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalResults
        fields = "__all__"

    def validate(self, data):
        placement = data.get("placement") or getattr(self.instance, "placement", None)
        request = self.context.get("request") if hasattr(self, "context") else None
        user = getattr(request, "user", None) if request else None
        if not placement or not user or placement.academic_supervisor != user:
            raise serializers.ValidationError(
                "Only the academic supervisor can set final results for this placement."
            )
        evaluator = None

        if placement:
            evaluator = placement.academic_supervisor
        request = self.context.get("request") if hasattr(self, "context") else None
        if request is not None and hasattr(request, "user"):
            if (
                evaluator
                and evaluator != request.user
                and request.user.role != "academic_supervisor"
            ):
                raise serializers.ValidationError(
                    "Only the academic supervisor can set final results for this placement."
                )
        elif evaluator and evaluator.role != "academic_supervisor":
            raise serializers.ValidationError(
                "Only the academic supervisor can set final results for this placement."
            )
        return data
