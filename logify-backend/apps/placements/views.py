from django.db import transaction
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import InternshipPlacements, PlacementStatusHistory
from .serializer import InternshipPlacementsSerializer


class InternshipPlacementsViewSet(viewsets.ModelViewSet):
    queryset = InternshipPlacements.objects.all()
    serializer_class = InternshipPlacementsSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        placement = self.get_object()

        if placement.status != "draft":
            return Response(
                {"error": f"Cannot submit a placement in {placement.status} status"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            old_status = placement.status

            placement.status = "submitted"
            placement.submitted_at = timezone.now()
            placement.save()

            PlacementStatusHistory.objects.create(
                placement=placement,
                from_status=old_status,
                to_status="submitted",
                changed_by=request.user,
                comment=request.data.get("comment", "Placement submitted."),
            )
        serializer = self.get_serializer(placement)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        placement = self.get_object()

        if request.user != placement.academic_supervisor:
            return Response(
                {"error": "Only an assigned Academic Supervisor can approve this placement."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if placement.status != "submitted":
            return Response(
                {"error": "Placement must be submitted before it can be approved."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        with transaction.atomic():
            old_status = placement.status
            placement.status = "approved"
            placement.approved_at = timezone.now()
            placement.save()

            PlacementStatusHistory.objects.create(
                placement=placement,
                from_status=old_status,
                to_status="approved",
                changed_by=request.user,
                comment=request.data.get("comment", "Placement approved."),
            )
        return Response(self.get_serializer(placement).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        placement = self.get_object()

        if request.user != placement.academic_supervisor:
            return Response(
                {"error": "Only an assigned Academic Supervisor can reject this placement."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if placement.status != "submitted":
            return Response(
                {"error": "Placement must be submitted before it can be rejected."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        with transaction.atomic():
            old_status = placement.status
            placement.status = "rejected"
            placement.save()

            PlacementStatusHistory.objects.create(
                placement=placement,
                from_status=old_status,
                to_status="rejected",
                changed_by=request.user,
                comment=request.data.get("comment", "Placement rejected."),
            )
        return Response(self.get_serializer(placement).data)

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        placement = self.get_object()

        if request.user != placement.academic_supervisor:
            return Response(
                {"error": "Only an assigned Academic Supervisor can activate this placement."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if placement.status != "approved":
            return Response(
                {"error": "Placement must be approved before it can be activated."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        with transaction.atomic():
            old_status = placement.status
            placement.status = "active"
            placement.save()

            PlacementStatusHistory.objects.create(
                placement=placement,
                from_status=old_status,
                to_status="active",
                changed_by=request.user,
                comment=request.data.get("comment", "Placement activated."),
            )
        return Response(self.get_serializer(placement).data)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        placement = self.get_object()

        if request.user != placement.academic_supervisor:
            return Response(
                {
                    "error": "Only an assigned Academic Supervisor can mark this placement as completed."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if placement.status != "active":
            return Response(
                {"error": "Only active placements can be marked as completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        with transaction.atomic():
            old_status = placement.status
            placement.status = "completed"
            placement.save()

            PlacementStatusHistory.objects.create(
                placement=placement,
                from_status=old_status,
                to_status="completed",
                changed_by=request.user,
                comment=request.data.get("comment", "Internship completed."),
            )
        return Response(self.get_serializer(placement).data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        placement = self.get_object()

        if request.user != placement.academic_supervisor:
            return Response(
                {"error": "Only an assigned Academic Supervisor can cancel this placement."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if placement.status == "completed":
            return Response(
                {"error": "Cannot cancel a placement that is already completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        with transaction.atomic():
            old_status = placement.status
            placement.status = "cancelled"
            placement.save()

            PlacementStatusHistory.objects.create(
                placement=placement,
                from_status=old_status,
                to_status="cancelled",
                changed_by=request.user,
                comment=request.data.get("comment", "Placement cancelled."),
            )
        return Response(self.get_serializer(placement).data)

    def perform_update(self, serializer):
        instance = self.get_object()

        locked_statuses = ["approved", "active", "completed", "cancelled"]

        if instance.status in locked_statuses:
            raise ValidationError(
                {"error": f"Cannot modify placement once it is {instance.status}."}
            )
        serializer.save()

    @action(detail=True, methods=["post"], url_path="assign-academic-supervisor")
    def assign_academic_supervisor(self, request, pk=None):
        placement = self.get_object()
        user_id = request.data.get("user_id")

        if not user_id:
            return Response({"error": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        placement.academic_supervisor_id = user_id
        placement.save()

        return Response({"message": "Academic supervisor assigned successfully."})

    @action(detail=True, methods=["post"], url_path="assign-workplace-supervisor")
    def assign_workplace_supervisor(self, request, pk=None):
        placement = self.get_object()
        user_id = request.data.get("user_id")

        if not user_id:
            return Response({"error": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        placement.workplace_supervisor_id = user_id
        placement.save()

        return Response({"message": "Workplace supervisor assigned successfully."})
