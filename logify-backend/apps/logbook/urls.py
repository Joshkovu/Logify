from django.urls import path

from . import views

urlpatterns = [
    path("create_weekly_log/", views.create_weekly_log, name="create_weekly_log")  # type: ignore
]
