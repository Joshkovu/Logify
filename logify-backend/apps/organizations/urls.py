from django.urls import path

from .views import OrganizationDetailView, OrganizationListCreateView

urlpatterns = [
    path("organizations/", OrganizationListCreateView.as_view(), name="organization-list-create"),
    path("organizations/<int:pk>/", OrganizationDetailView.as_view(), name="organization-detail"),
]
