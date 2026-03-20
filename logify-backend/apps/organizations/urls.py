from django.urls import path

from .views import OrganizationDetailView, OrganizationListCreateView

urlpatterns = [
    path(
        "createOrganization", OrganizationListCreateView.as_view(), name="organization-list-create"
    ),
    path("getOrganization/<int:pk>/", OrganizationDetailView.as_view(), name="organization-detail"),
]
