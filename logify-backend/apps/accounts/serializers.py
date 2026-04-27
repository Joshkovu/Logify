from rest_framework import serializers

from .models import StaffProfiles, SupervisorApplication, User


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
    college_id = serializers.IntegerField(write_only=True)
    staff_number = serializers.CharField(write_only=True, required=False)
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
            "college_id",
            "staff_number",
            "title",
        )

    def validate_role(self, value):
        if value not in [User.WORKPLACE_SUPERVISOR, User.ACADEMIC_SUPERVISOR]:
            raise serializers.ValidationError("Invalid role for supervisor signup.")
        return value

    def validate_college_id(self, value):
        from apps.academics.models import Colleges

        if not Colleges.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid college selected.")
        return value

    def create(self, validated_data):
        from apps.academics.models import Colleges

        from .models import SupervisorApplication

        password = validated_data.pop("password")
        role = validated_data.pop("role", None)
        college_id = validated_data.pop("college_id")
        staff_number = validated_data.pop("staff_number", None)
        title = validated_data.pop("title", None)

        college = Colleges.objects.get(id=college_id)
        institution_id = college.institution_id

        # Create inactive user in the selected college's institution.
        user = User.objects.create_user(
            is_active=False, institution_id=str(institution_id), **validated_data
        )
        user.set_password(password)
        if role is not None:  # type: ignore
            user.role = role  # type: ignore
        user.save()

        # Create SupervisorApplication
        SupervisorApplication.objects.create(user=user)

        # Link staff profile to the selected college when profile fields are provided.
        if staff_number and title:
            StaffProfiles.objects.create(
                user=user, staff_number=staff_number, department=college, title=title
            )

        return user


class AdminSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    college_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "password", "first_name", "last_name", "phone", "college_id")

    def validate_college_id(self, value):
        from apps.academics.models import Colleges

        if not Colleges.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid college selected.")
        return value

    def create(self, validated_data):
        from apps.academics.models import Colleges

        password = validated_data.pop("password")
        college_id = validated_data.pop("college_id")
        college = Colleges.objects.get(id=college_id)
        institution_id = college.institution_id

        user = User.objects.create_user(
            role=User.INTERNSHIP_ADMIN,
            is_active=True,
            is_staff=True,
            institution_id=str(institution_id),
            **validated_data,
        )
        user.set_password(password)
        user.save()
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
            "year_of_study",
            "intake_year",
            "is_active",
            "staff_profile",
        )


class MeUpdateSerializer(serializers.ModelSerializer):
    title = serializers.CharField(write_only=True, required=False, allow_blank=True)
    student_number = serializers.IntegerField(required=False)

    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "phone", "title", "student_number")

    def validate_email(self, value):
        user = self.instance
        existing = User.objects.exclude(pk=user.pk).filter(email=value).exists()
        if existing:
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def update(self, instance, validated_data):
        title = validated_data.pop("title", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if title is not None and hasattr(instance, "staffprofiles"):
            staff_profile = instance.staffprofiles
            staff_profile.title = title
            staff_profile.save(update_fields=["title"])

        return instance


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        if value.strip() != value:
            raise serializers.ValidationError("New password cannot start or end with spaces.")
        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user


class SupervisorApplicationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)
    phone = serializers.CharField(source="user.phone", read_only=True)
    is_active = serializers.BooleanField(source="user.is_active", read_only=True)
    full_name = serializers.SerializerMethodField()
    staff_profile = StaffProfilesSerializer(source="user.staffprofiles", read_only=True)

    class Meta:
        model = SupervisorApplication
        fields = (
            "id",
            "status",
            "created_at",
            "updated_at",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "phone",
            "is_active",
            "staff_profile",
        )

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()
