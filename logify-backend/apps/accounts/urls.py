from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.login_view, name="accounts_login"),
    path("logout/", views.logout_view, name="accounts_logout"),
    path("me/", views.current_user_view, name="accounts_me"),
]
