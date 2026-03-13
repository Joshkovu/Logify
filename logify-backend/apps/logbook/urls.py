from django.urls import path

from . import views

urlpatterns = [
    path("create_weekly_log/", views.CreateWeeklyLogAPIView.as_view(), name="create_weekly_log"),  # type: ignore
    path("update_weekly_log/<int:log_id>/", views.UpdateWeeklyLogAPIView.as_view(), name="update_weekly_log"),  # type: ignore
    path("submit_weekly_log/<int:log_id>/", views.SubmitWeeklyLogAPIView.as_view(), name="submit_weekly_log"),  # type: ignore
    path("approve_weekly_log/<int:log_id>/", views.ApproveWeeklyLogAPIView.as_view(), name="approve_weekly_log"),  # type: ignore
    path("reject_weekly_log/<int:log_id>/", views.RejectWeeklyLogAPIView.as_view(), name="reject_weekly_log"),  # type: ignore
    path("request_changes_weekly_log/<int:log_id>/", views.RequestChangesWeeklyLogAPIView.as_view(), name="request_changes_weekly_log"),  # type: ignore
    path("weekly_log_status/<int:log_id>/", views.GetWeeklyLogAPIView.as_view(), name="weekly_log_status"),  # type: ignore
]
