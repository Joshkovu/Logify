from django.urls import path

from . import views

urlpatterns = [
    path("weekly_logs_report/<int:student_id>/", views.WeeklyLogsReportAPIView.as_view(), name="weekly_logs_report"),  # type: ignore
]
