from apps.evaluations.models import (
    EvaluationCriteria,
    EvaluationRubrics,
    Evaluations,
    EvaluationScores,
    FinalResults,
)
from apps.logbook.models import WeeklyLogs
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

            if instance is not None:
                criteria_qs = criteria_qs.exclude(pk=instance.pk)
            exists = criteria_qs.exists()
            if exists:
                raise serializers.ValidationError("Criterion name must be unique within a rubric.")

        if rubric and weight_percent is not None:
            total_weight = (
                EvaluationCriteria.objects.filter(rubric=rubric).aggregate(
                    models.Sum("weight_percent")
                )["weight_percent__sum"]
                or 0
            )
            if instance is not None:
                total_weight -= instance.weight_percent
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
        extra_kwargs = {
            "evaluator": {"read_only": True},
            "evaluator_type": {"read_only": True},
        }

    def validate(self, data):
        instance = getattr(self, "instance", None)
        request = self.context.get("request")
        user = getattr(request, "user", None)
        placement = data.get("placement") or getattr(instance, "placement", None)
        rubric = data.get("rubric") or getattr(instance, "rubric", None)
        evaluator = data.get("evaluator") or getattr(instance, "evaluator", None)
        evaluator_type = data.get("evaluator_type") or getattr(instance, "evaluator_type", None)

        if user is not None and getattr(user, "is_authenticated", False):
            evaluator = user
            data["evaluator"] = user
            evaluator_type = user.role
            data["evaluator_type"] = user.role

        if not placement or not rubric or not evaluator:
            raise serializers.ValidationError("Placement, rubric, and evaluator are required.")

        if rubric.institution_id != placement.institution_id or rubric.programme_id != placement.programme_id:
            raise serializers.ValidationError(
                "The selected rubric does not belong to the placement's institution/programme."
            )

        if evaluator_type is None:
            evaluator_type = evaluator.role

        if evaluator_type and evaluator.role != evaluator_type:
            raise serializers.ValidationError(
                "The evaluator_type must match the selected evaluator's role."
            )

        if user is not None and getattr(user, "is_authenticated", False):
            if evaluator != user and not user.is_superuser and user.role != "internship_admin":
                raise serializers.ValidationError("You can only create or update your own evaluations.")
            if (
                user.role == "academic_supervisor"
                and placement.academic_supervisor_id != user.id
            ):
                raise serializers.ValidationError(
                    "You are not assigned as the academic supervisor for this placement."
                )
            if (
                user.role == "workplace_supervisor"
                and placement.workplace_supervisor_id != user.id
            ):
                raise serializers.ValidationError(
                    "You are not assigned as the workplace supervisor for this placement."
                )

        return data

    def _compute_total_score(self, evaluation):
        scores = evaluation.evaluationscores_set.select_related("criterion")
        if not scores.exists():
            return evaluation.total_score

        total = 0.0
        for score in scores:
            max_score = score.criterion.max_score or 0
            if max_score <= 0:
                continue
            total += (score.score / max_score) * score.criterion.weight_percent
        return round(total, 2)

    def create(self, validated_data):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user is not None and getattr(user, "is_authenticated", False):
            validated_data["evaluator"] = user
            validated_data["evaluator_type"] = user.role
        evaluation = super().create(validated_data)
        evaluation.total_score = self._compute_total_score(evaluation)
        evaluation.save(update_fields=["total_score"])
        return evaluation

    def update(self, instance, validated_data):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user is not None and getattr(user, "is_authenticated", False):
            validated_data["evaluator"] = user
            validated_data["evaluator_type"] = user.role
        evaluation = super().update(instance, validated_data)
        evaluation.total_score = self._compute_total_score(evaluation)
        evaluation.save(update_fields=["total_score", "updated_at"])
        return evaluation


class EvaluationScoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationScores
        fields = "__all__"

    def validate(self, data):
        instance = getattr(self, "instance", None)
        evaluation = data.get("evaluation") or getattr(instance, "evaluation", None)
        criterion = data.get("criterion") or getattr(instance, "criterion", None)
        score_value = data.get("score", getattr(instance, "score", None))
        if evaluation and criterion:
            if evaluation.rubric_id != criterion.rubric_id:
                raise serializers.ValidationError(
                    "The selected criterion does not belong to this evaluation's rubric."
                )

            exists_qs = EvaluationScores.objects.filter(
                evaluation=evaluation, criterion=criterion
            )
            if instance is not None:
                exists_qs = exists_qs.exclude(pk=instance.pk)
            exists = exists_qs.exists()
            if exists:
                raise serializers.ValidationError(
                    "Score for this criterion and evaluation already exists."
                )

            if score_value is not None and (score_value < 0 or score_value > criterion.max_score):
                raise serializers.ValidationError(
                    f"Score must be between 0 and {criterion.max_score} for this criterion."
                )

            request = self.context.get("request") if hasattr(self, "context") else None
            user = getattr(request, "user", None) if request else None
            if user is not None and evaluation.evaluator_id != user.id and not user.is_superuser:
                raise serializers.ValidationError(
                    "You can only manage scores for your own evaluations."
                )
        return data

    def _refresh_evaluation_total(self, evaluation):
        total = 0.0
        scores = evaluation.evaluationscores_set.select_related("criterion")
        for item in scores:
            max_score = item.criterion.max_score or 0
            if max_score <= 0:
                continue
            total += (item.score / max_score) * item.criterion.weight_percent
        evaluation.total_score = round(total, 2)
        evaluation.save(update_fields=["total_score", "updated_at"])

    def create(self, validated_data):
        score = super().create(validated_data)
        self._refresh_evaluation_total(score.evaluation)
        return score

    def update(self, instance, validated_data):
        score = super().update(instance, validated_data)
        self._refresh_evaluation_total(score.evaluation)
        return score


class FinalResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalResults
        fields = "__all__"
        extra_kwargs = {
            "logbook_score": {"required": False},
            "academic_score": {"required": False},
            "final_score": {"required": False},
            "final_grade": {"required": False},
        }

    def validate(self, data):
        placement = data.get("placement") or getattr(self.instance, "placement", None)
        request = self.context.get("request") if hasattr(self, "context") else None
        user = getattr(request, "user", None) if request else None
        if not placement or not user or placement.academic_supervisor != user:
            raise serializers.ValidationError(
                "Only the academic supervisor can set final results for this placement."
            )

        duplicate_qs = FinalResults.objects.filter(placement=placement)
        if self.instance is not None:
            duplicate_qs = duplicate_qs.exclude(pk=self.instance.pk)
        if duplicate_qs.exists():
            raise serializers.ValidationError(
                "A final result already exists for this placement."
            )
        return data

    def _compute_logbook_score(self, placement):
        reviewed_logs = WeeklyLogs.objects.filter(placement=placement).exclude(status="draft")
        if not reviewed_logs.exists():
            return 0.0
        approved_logs = reviewed_logs.filter(status="approved").count()
        return round((approved_logs / reviewed_logs.count()) * 100, 2)

    def _compute_academic_score(self, placement, rubric):
        evaluations_qs = Evaluations.objects.filter(
            placement=placement,
            evaluator_type="academic_supervisor",
            status="reviewed",
        ).order_by("-updated_at", "-submitted_at", "-created_at")
        if rubric is not None:
            evaluations_qs = evaluations_qs.filter(rubric=rubric)
        latest = evaluations_qs.first()
        if latest is None:
            return 0.0

        scores = latest.evaluationscores_set.select_related("criterion")
        if scores.exists():
            total = 0.0
            for score in scores:
                max_score = score.criterion.max_score or 0
                if max_score <= 0:
                    continue
                total += (score.score / max_score) * score.criterion.weight_percent
            return round(total, 2)

        return round(latest.total_score or 0.0, 2)

    def _compute_grade(self, final_score):
        if final_score >= 80:
            return "A"
        if final_score >= 70:
            return "B"
        if final_score >= 60:
            return "C"
        if final_score >= 50:
            return "D"
        return "F"

    def _build_result_values(self, validated_data):
        placement = validated_data["placement"]
        rubric = validated_data.get("rubric")
        academic_score = validated_data.get("academic_score")
        if academic_score is None:
            academic_score = self._compute_academic_score(placement, rubric)

        logbook_score = validated_data.get("logbook_score")
        if logbook_score is None:
            logbook_score = self._compute_logbook_score(placement)

        final_score = validated_data.get("final_score")
        if final_score is None:
            final_score = round((academic_score * 0.7) + (logbook_score * 0.3), 2)

        final_grade = validated_data.get("final_grade") or self._compute_grade(final_score)

        validated_data["academic_score"] = academic_score
        validated_data["logbook_score"] = logbook_score
        validated_data["final_score"] = final_score
        validated_data["final_grade"] = final_grade
        return validated_data

    def create(self, validated_data):
        return super().create(self._build_result_values(validated_data))

    def update(self, instance, validated_data):
        return super().update(instance, self._build_result_values(validated_data))
