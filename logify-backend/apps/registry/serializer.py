from rest_framework import serializers

from .models import StudentRegistry


class StudentRegistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentRegistry
        fields = "__all__"
<<<<<<< HEAD


class RegistrationAttemptsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationAttempts
        exclude = (
            "otp_hash",
            "password_hash",
        )
=======
>>>>>>> 0657105d0cd97afad7b89a4ad48542f58ba79b39
