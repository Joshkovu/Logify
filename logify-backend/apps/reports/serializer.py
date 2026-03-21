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
        # Validate report_type
        report_type = attrs.get("report_type")
        valid_types = [choice[0] for choice in self.Meta.model.REPORT_TYPE_CHOICES]
        if report_type and report_type not in valid_types:
            raise serializers.ValidationError("Invalid report type.")
        # Validate evaluation_score
        score = attrs.get("evaluation_score")
        if score is not None and score < 0:
            raise serializers.ValidationError("Evaluation score must be non-negative.")
        return attrs
