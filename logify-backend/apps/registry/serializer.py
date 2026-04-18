from rest_framework import serializers

from .models import RegistrationAttempts, StudentRegistry


class StudentRegistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentRegistry
        fields = "__all__"


class RegistrationAttemptsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationAttempts
        exclude = (
            "otp_hash",
            "password_hash",
        )
