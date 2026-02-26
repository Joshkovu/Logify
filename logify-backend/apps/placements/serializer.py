from rest_framework import serializers

from .models import InternshipPlacements, PlacementContacts, PlacementStatusHistory


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
