from apps.accounts.models import User
from apps.organizations.models import Organizations
from apps.organizations.serializers import OrganizationSerializer
from rest_framework import serializers

from .models import InternshipPlacements, PlacementContacts, PlacementStatusHistory


class InternshipPlacementsSerializer(serializers.ModelSerializer):
    organization = serializers.PrimaryKeyRelatedField(
        queryset=Organizations.objects.all(), required=False
    )
    organization_details = OrganizationSerializer(write_only=True, required=False)
    workplace_supervisor_name = serializers.CharField(write_only=True, required=False)
    workplace_supervisor_email = serializers.EmailField(write_only=True, required=False)
    academic_supervisor_name = serializers.CharField(write_only=True, required=False)
    academic_supervisor_email = serializers.EmailField(write_only=True, required=False)

    class Meta:
        model = InternshipPlacements
        fields = (
            "id",
            "intern",
            "institution",
            "programme",
            "organization",
            "organization_details",
            "workplace_supervisor",
            "academic_supervisor",
            "workplace_supervisor_name",
            "workplace_supervisor_email",
            "academic_supervisor_name",
            "academic_supervisor_email",
            "start_date",
            "end_date",
            "work_mode",
            "internship_title",
            "department_at_company",
            "status",
            "submitted_at",
            "approved_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "intern",
            "institution",
            "programme",
            "workplace_supervisor",
            "academic_supervisor",
            "status",
            "submitted_at",
            "approved_at",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        attrs = super().validate(attrs)

        supervisor_inputs = {
            "workplace_supervisor_name": attrs.pop("workplace_supervisor_name", None),
            "workplace_supervisor_email": attrs.pop("workplace_supervisor_email", None),
            "academic_supervisor_name": attrs.pop("academic_supervisor_name", None),
            "academic_supervisor_email": attrs.pop("academic_supervisor_email", None),
        }

        errors = {}

        for field_name in ("workplace_supervisor_name", "academic_supervisor_name"):
            value = supervisor_inputs[field_name]
            if isinstance(value, str):
                supervisor_inputs[field_name] = value.strip()

        for field_name in ("workplace_supervisor_email", "academic_supervisor_email"):
            value = supervisor_inputs[field_name]
            if isinstance(value, str):
                supervisor_inputs[field_name] = value.strip().lower()

        if not attrs.get("organization") and not attrs.get("organization_details"):
            errors = errors or {}
            errors["organization"] = ["Organization id or organization_details is required."]

        if attrs.get("organization") and attrs.get("organization_details"):
            errors = errors or {}
            errors["organization_details"] = [
                "Provide either organization or organization_details, not both."
            ]

        self._validate_supervisor_pair(
            supervisor_inputs,
            "workplace_supervisor",
            "Workplace supervisor",
            User.WORKPLACE_SUPERVISOR,
            errors,
            attrs,
        )
        self._validate_supervisor_pair(
            supervisor_inputs,
            "academic_supervisor",
            "Academic supervisor",
            User.ACADEMIC_SUPERVISOR,
            errors,
            attrs,
        )

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        organization_data = validated_data.pop("organization_details", None)
        if organization_data:
            validated_data["organization"] = Organizations.objects.create(**organization_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        organization_data = validated_data.pop("organization_details", None)
        if organization_data:
            validated_data["organization"] = Organizations.objects.create(**organization_data)
        return super().update(instance, validated_data)

    def _validate_supervisor_pair(
        self,
        supervisor_inputs,
        prefix,
        label,
        expected_role,
        errors,
        attrs,
    ):
        name_key = f"{prefix}_name"
        email_key = f"{prefix}_email"
        provided_name = supervisor_inputs.get(name_key)
        provided_email = supervisor_inputs.get(email_key)

        is_create = self.instance is None
        provided_any = bool(provided_email or provided_name)

        if is_create and not provided_email:
            errors[email_key] = [f"{label} email is required."]

        if provided_name and not provided_email:
            errors[email_key] = [f"{label} email is required."]

        if not is_create and not provided_any:
            return

        if provided_any and not provided_email:
            return

        try:
            supervisor = User.objects.get(email__iexact=provided_email)
        except User.DoesNotExist:
            errors[email_key] = [f"{label} does not exist."]
            return

        if supervisor.role != expected_role:
            errors[email_key] = [f"{label} does not exist."]
            return

        attrs[prefix] = supervisor


class PlacementStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementStatusHistory
        fields = "__all__"


class PlacementContactsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementContacts
        fields = "__all__"
