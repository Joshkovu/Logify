from rest_framework import serializers

from .models import StudentRegistry


class StudentRegistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentRegistry
        fields = "__all__"
