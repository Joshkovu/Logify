from django import forms
from rest_framework import serializers

from .models import SupervisorReviews, WeeklyLogs, WeeklyLogStatusHistory


class WeeklyLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLogs
        fields = "__all__"


class WeeklyLogsForm(forms.ModelForm):
    class Meta:
        model = WeeklyLogs
        fields = [
            "week_number",
            "week_start_date",
            "week_end_date",
            "activities",
            "challenges",
            "learnings",
        ]
        widgets = {
            "week_start_date": forms.DateInput(attrs={"type": "date"}),
            "week_end_date": forms.DateInput(attrs={"type": "date"}),
            "activities": forms.Textarea(attrs={"rows": 5}),
            "challenges": forms.Textarea(attrs={"rows": 5}),
            "learnings": forms.Textarea(attrs={"rows": 5}),
        }


class WeeklyLogStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLogStatusHistory
        fields = "__all__"


class SupervisorReviewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupervisorReviews
        fields = "__all__"
