from rest_framework import serializers

from .models import (
    Departments,
    EvaluationCriteria,
    EvaluationRubrics,
    Evaluations,
    EvaluationScores,
    FinalResults,
    Institutions,
    InternshipPlacements,
    Organizations,
    PlacementContacts,
    PlacementStatusHistory,
    Programmes,
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
        fields = "__all__"
        exclude = ("password_hash",)

    def validate(self, attrs):
        """
        Prevent non-privileged users from modifying sensitive fields on User.
        """
        request = self.context.get("request")
        instance = getattr(self, "instance", None)
        if request and not request.user.is_staff or instance is None:
            if "is_staff" in attrs or "is_superuser" in attrs:
                raise serializers.ValidationError(
                    "You do not have permission to modify this field."
                )

        user = request.user if request else None
        is_privileged = bool(
            getattr(user, "is_staff", False) or getattr(user, "is_superuser", False)
        )
        if not is_privileged and ("is_staff" in attrs or "is_superuser" in attrs):
            raise serializers.ValidationError(
                "You do not have permission to modify this field."
            )
        return super().validate(attrs)


class InstitutionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institutions
        fields = "__all__"


class DepartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departments
        fields = "__all__"


class ProgrammesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programmes
        fields = "__all__"


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
