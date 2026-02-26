from rest_framework import serializers

from .models import Departments, Institutions, Programmes


class InstitutionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institutions
        fields = "__all__"


class DepartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departments
        fields = "__all__"


class ProgrammesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programmes
        fields = "__all__"
