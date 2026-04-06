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
    department_name = serializers.ReadOnlyField(source="department.name")

    class Meta:
        model = StaffProfiles
        fields = ("staff_number", "department", "department_name", "title")


class SupervisorSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    staff_number = serializers.CharField(write_only=True, required=False)
    department = serializers.IntegerField(write_only=True, required=False)
    title = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = (
            "email",
            "password",
            "first_name",
            "last_name",
            "role",
            "phone",
            "staff_number",
            "department",
            "title",
        )

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

        # Create StaffProfile if data provided
        staff_number = validated_data.pop("staff_number", None)
        department_id = validated_data.pop("department", None)
        title = validated_data.pop("title", None)

        if staff_number and department_id and title:
            from apps.academics.models import Departments

            department = Departments.objects.get(id=department_id)
            StaffProfiles.objects.create(
                user=user, staff_number=staff_number, department=department, title=title
            )

        return user


class StudentSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    fullName = serializers.CharField(write_only=True)
    matriculationNumber = serializers.CharField(write_only=True)
    institution = serializers.CharField(write_only=True)
    department = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "password", "fullName", "matriculationNumber", "institution", "department")

    def validate_role(self, value):
        if value != User.STUDENT:
            raise serializers.ValidationError("Invalid role for student signup.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        full_name = validated_data.pop("fullName")
        matriculation_number = validated_data.pop("matriculationNumber")
        institution = validated_data.pop("institution")
        department = validated_data.pop("department")

        # Split full name into first and last
        name_parts = full_name.split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        # Create active user
        user = User.objects.create_user(
            email=validated_data["email"],
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=User.STUDENT,
            student_registry_id=matriculation_number,
            institution_id=institution,
            programme_id=department,
            is_active=True
        )

        return user


class UserDetailSerializer(serializers.ModelSerializer):
    staff_profile = StaffProfilesSerializer(source="staffprofiles", read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "phone",
            "institution_id",
            "programme_id",
            "student_number",
            "is_active",
            "staff_profile",
        )
