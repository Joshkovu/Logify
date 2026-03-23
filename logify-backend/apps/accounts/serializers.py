from rest_framework import serializers

from .models import StaffProfiles, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ("password_hash",)

    def validate_role(self, value):
        allowed_roles = [choice[0] for choice in User.ROLE_CHOICES]
        if value not in allowed_roles:
            raise serializers.ValidationError("Invalid role.")
        return value

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user if request else None

        if "role" in attrs:
            if attrs["role"] in [
                User.WORKPLACE_SUPERVISOR,
                User.ACADEMIC_SUPERVISOR,
                User.INTERNSHIP_ADMIN,
            ]:
                if not user or user.role != User.INTERNSHIP_ADMIN:
                    raise serializers.ValidationError(
                        "Only internship administrators can assign supervisor or admin roles."
                    )
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if "password_hash" in data:
            data.pop("password_hash")
        return data


class StaffProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfiles
        fields = "__all__"


class SupervisorSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "password", "first_name", "last_name", "role", "phone")

    def validate_role(self, value):
        if value not in [User.WORKPLACE_SUPERVISOR, User.ACADEMIC_SUPERVISOR]:
            raise serializers.ValidationError("Invalid role for supervisor signup.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        role = validated_data.pop("role", None)

        # Create inactive user
        user = User.objects.create_user(is_active=False, **validated_data)
        user.set_password(password)
        if role is not None:  # type: ignore
            user.role = role  # type: ignore
        user.save()

        # Create SupervisorApplication
        from .models import SupervisorApplication

        SupervisorApplication.objects.create(user=user)

        return user
