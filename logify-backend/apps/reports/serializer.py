from rest_framework import serializers

from .models import InternshipReport


class InternshipReportSerializer(serializers.Serializer):
    class Meta:
        model = InternshipReport
        fields = "__all__"
