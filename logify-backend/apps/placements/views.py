# from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import InternshipPlacements, PlacementStatusHistory
from .serializer import InternshipPlacementsSerializer

# Create your views here.
User = get_user_model()

VALID_TRANSITIONS = {
    "draft": ["submitted", "cancelled"],
    "submitted": ["approved", "rejected", "cancelled"],
    "approved": ["active", "cancelled"],
    "active": ["completed", "cancelled"],
}


def transition_placement(placement, new_status, user, comment=None):
    if new_status not in VALID_TRANSITIONS.get(placement.status, []):
        raise ValidationError(f"Cannot transition from {placement.status} to {new_status}")
    old_status = placement.status
    placement.status = new_status
    if new_status == "submitted":
        placement.submitted_at = timezone.now()
    elif new_status == "approved":
        placement.approved_at = timezone.now()

    placement.save()

    PlacementStatusHistory.objects.create(
        placement=placement,
        from_status=old_status,
        to_status=new_status,
        changed_by=user,
        comment=comment,
    )
    return placement


class InternshipPlacementListCreateView(generics.ListCreateAPIView):
    queryset = InternshipPlacements.objects.all()
    serializer_class = InternshipPlacementsSerializer


class PlacementRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InternshipPlacements.objects.all()
    serializer_class = InternshipPlacementsSerializer

    def update(self, request, *args, **kwargs):
        placement = self.get_object()
        if placement.status in ["approved", "active", "completed"]:
            raise ValidationError("Cannot edit placement in its current status.")
        return super().update(request, *args, **kwargs)


class PlacementWorkflowView(APIView):
    def post(self, request, pk, action_name):
        placement = InternshipPlacements.objects.get(pk=pk)
        comment = request.data.get("comment", "")

        action_map = {
            "submit": "submitted",
            "approve": "approved",
            "reject": "rejected",
            "activate": "active",
            "complete": "completed",
            "cancel": "cancelled",
        }
        if action_name not in action_map:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            transition_placement(placement, action_map[action_name], request.user, comment)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"status": placement.status})


class AssignWorkplaceSupervisor(APIView):
    def post(self, request, pk):
        placement = InternshipPlacements.objects.get(pk=pk)
        supervisor_id = request.data.get("supervisor_id")

        try:
            supervisor = User.objects.get(id=supervisor_id)
        except User.DoesNotExist:
            return Response({"error": "Supervisor not found"}, status=status.HTTP_404_NOT_FOUND)

        placement.workplace_supervisor = supervisor
        placement.save()
        return Response({"success": True, "workplace_supervisor": supervisor.id})


class AssignAcademicSupervisor(APIView):
    def post(self, request, pk):
        placement = InternshipPlacements.objects.get(pk=pk)
        supervisor_id = request.data.get("supervisor_id")

        try:
            supervisor = User.objects.get(id=supervisor_id)
        except User.DoesNotExist:
            return Response({"error": "Supervisor not found"}, status=status.HTTP_404_NOT_FOUND)

        placement.academic_supervisor = supervisor
        placement.save()
        return Response({"success": True, "academic_supervisor": supervisor.id})
