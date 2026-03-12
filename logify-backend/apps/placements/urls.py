from django.urls import path

from .views import (
    AssignAcademicSupervisor,
    AssignWorkplaceSupervisor,
    InternshipPlacementListCreateView,
    PlacementRetrieveUpdateDestroyView,
    PlacementWorkflowView,
)

urlpatterns = [
    path("placements/", InternshipPlacementListCreateView.as_view()),
    path("placements/<int:pk>/", PlacementRetrieveUpdateDestroyView.as_view()),
    path("placements/<int:pk>/<str:action_name>/", PlacementWorkflowView.as_view()),
    path("placements/<int:pk>/assign-workplace-supervisor/", AssignWorkplaceSupervisor.as_view()),
    path("placements/<int:pk>/assign-academic-supervisor/", AssignAcademicSupervisor.as_view()),
]
