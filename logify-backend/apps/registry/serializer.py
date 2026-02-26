from rest_framework import serializers

from .models import RegistrationAttempts, StudentRegistry


class StudentRegistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentRegistry
        fields = "__all__"


class RegistrationAttemptsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationAttempts
        fields = "__all__"
        exclude = ("otp_hash",)
