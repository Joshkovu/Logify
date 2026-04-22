from rest_framework import serializers

from .models import InternshipPlacements, PlacementContacts, PlacementStatusHistory


class InternshipPlacementsSerializer(serializers.ModelSerializer):
    institution_name = serializers.ReadOnlyField(source="institution.name")
    intern_first_name = serializers.ReadOnlyField(source="intern.first_name")
    intern_last_name = serializers.ReadOnlyField(source="intern.last_name")
    intern_email = serializers.ReadOnlyField(source="intern.email")
    programme_name = serializers.ReadOnlyField(source="programme.name")
    organization_name = serializers.ReadOnlyField(source="organization.name")
    class Meta:
        model = InternshipPlacements
        fields = "__all__"
        read_only_fields = [
            "intern",
            "institution",
            "programme",
        ]


class PlacementStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementStatusHistory
        fields = "__all__"


class PlacementContactsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementContacts
        fields = "__all__"
