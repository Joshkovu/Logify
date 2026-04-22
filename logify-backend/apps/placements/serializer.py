from apps.accounts.models import User
from rest_framework import serializers

from .models import InternshipPlacements, PlacementContacts, PlacementStatusHistory


class InternshipPlacementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipPlacements
        fields = "__all__"
        read_only_fields = [
            "intern",
            "institution",
            "programme",
            "status",
            "submitted_at",
            "approved_at",
            "created_at",
            "updated_at",
        ]

    def validate_academic_supervisor(self, value):
        if value and value.role != User.ACADEMIC_SUPERVISOR:
            raise serializers.ValidationError("Selected user is not an academic supervisor.")
        return value

    def validate_workplace_supervisor(self, value):
        if value and value.role != User.WORKPLACE_SUPERVISOR:
            raise serializers.ValidationError("Selected user is not a workplace supervisor.")
        return value


class PlacementStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementStatusHistory
        fields = "__all__"


class PlacementContactsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementContacts
        fields = "__all__"
