from rest_framework import serializers

from .models import (
    EvaluationCriteria,
    EvaluationRubrics,
    Evaluations,
    EvaluationScores,
    FinalResults,
    InternshipPlacements,
    Organizations,
    PlacementContacts,
    PlacementStatusHistory,
    RegistrationAttempts,
    StaffProfiles,
    StudentRegistry,
    SupervisorReviews,
    User,
    WeeklyLogs,
    WeeklyLogStatusHistory,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ("password_hash",)

    def validate_role(self, value):
        allowed_roles = [choice[0] for choice in User.ROLE_CHOICES]
        if value not in allowed_roles:
            raise serializers.ValidationError("Invalid role.")
        return value

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user if request else None

        if "role" in attrs:
            if attrs["role"] in [
                User.WORKPLACE_SUPERVISOR,
                User.ACADEMIC_SUPERVISOR,
                User.INTERNSHIP_ADMIN,
            ]:
                if not user or user.role != User.INTERNSHIP_ADMIN:
                    raise serializers.ValidationError(
                        "Only internship administrators can assign supervisor or admin roles."
                    )
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if "password_hash" in data:
            data.pop("password_hash")
        return data


class StudentRegistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentRegistry
        fields = "__all__"


class RegistrationAttemptsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationAttempts
        fields = "__all__"
        exclude = ("otp_hash",)


class StaffProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfiles
        fields = "__all__"


class OrganizationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizations
        fields = "__all__"


class InternshipPlacementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipPlacements
        fields = "__all__"


class PlacementStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementStatusHistory
        fields = "__all__"


class PlacementContactsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementContacts
        fields = "__all__"


class WeeklyLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLogs
        fields = "__all__"


class WeeklyLogStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLogStatusHistory
        fields = "__all__"


class SupervisorReviewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupervisorReviews
        fields = "__all__"


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
