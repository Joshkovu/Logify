from django.urls import path

from . import views

urlpatterns = [
    path("create_weekly_log/", views.CreateWeeklyLogAPIView.as_view(), name="create_weekly_log")  # type: ignore
]
