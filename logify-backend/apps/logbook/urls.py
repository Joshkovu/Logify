from django.urls import path

from . import views

urlpatterns = [
    path("create_weekly_log/", views.CreateWeeklyLogAPIView.as_view(), name="create_weekly_log"),  # type: ignore
    path("update_weekly_log/<str:log_id>/", views.UpdateWeeklyLogAPIView.as_view(), name="update_weekly_log"),  # type: ignore
    path("submit_weekly_log/<str:log_id>/", views.SubmitWeeklyLogAPIView.as_view(), name="submit_weekly_log"),  # type: ignore
]
