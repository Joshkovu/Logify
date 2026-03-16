from rest_framework import serializers

from .models import InternshipReport


class InternshipReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipReport
        fields = "__all__"

    def validate(self, attrs):
        if attrs["internship_end"] <= attrs["internship_start"]:
            raise serializers.ValidationError(
                "Internship end date must be after internship start date"
            )
        return attrs
