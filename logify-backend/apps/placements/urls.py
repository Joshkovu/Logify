from django.urls import path

from .views import (
    InternshipPlacementDetailView,
    InternshipPlacementListCreateView,
    PlacementActivateView,
    PlacementApproveView,
    PlacementCancelView,
    PlacementCompleteView,
    PlacementRejectView,
    PlacementSubmitView,
    WorkplaceSupervisorAcceptView,
    WorkplaceSupervisorDenyView,
)

urlpatterns = [
    path("placements/", InternshipPlacementListCreateView.as_view(), name="placement-list-create"),
    path("placements/<int:pk>/", InternshipPlacementDetailView.as_view(), name="placement-detail"),
    path("placements/<int:pk>/submit/", PlacementSubmitView.as_view(), name="placement-submit"),
    path("placements/<int:pk>/approve/", PlacementApproveView.as_view(), name="placement-approve"),
    path("placements/<int:pk>/reject/", PlacementRejectView.as_view(), name="placement-reject"),
    path(
        "placements/<int:pk>/activate/", PlacementActivateView.as_view(), name="placement-activate"
    ),
    path(
        "placements/<int:pk>/complete/", PlacementCompleteView.as_view(), name="placement-complete"
    ),
    path("placements/<int:pk>/cancel/", PlacementCancelView.as_view(), name="placement-cancel"),
    # Workplace Supervisor accept / deny flow
    path(
        "placements/<int:pk>/ws-accept/",
        WorkplaceSupervisorAcceptView.as_view(),
        name="placement-ws-accept",
    ),
    path(
        "placements/<int:pk>/ws-deny/",
        WorkplaceSupervisorDenyView.as_view(),
        name="placement-ws-deny",
    ),
]
