from rest_framework import serializers

from .models import SupervisorReviews, WeeklyLogs, WeeklyLogStatusHistory


class WeeklyLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLogs
        fields = "__all__"


class WeeklyLogStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLogStatusHistory
        fields = "__all__"


class SupervisorReviewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupervisorReviews
        fields = "__all__"
