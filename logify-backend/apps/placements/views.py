from apps.accounts.models import User
from apps.accounts.permissions import (
    IsAcademicSupervisor,
    IsInternshipAdmin,
    IsStudent,
    IsWorkplaceSupervisor,
)
from django.db import transaction
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import InternshipPlacements, PlacementStatusHistory
from .serializer import InternshipPlacementsSerializer


class IsPlacementActor(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            IsStudent().has_permission(request, view)
            or IsAcademicSupervisor().has_permission(request, view)
            or IsWorkplaceSupervisor().has_permission(request, view)
            or IsInternshipAdmin().has_permission(request, view)
            or request.user.is_superuser
        )


class InternshipPlacementListCreateView(APIView):
    permission_classes = [IsPlacementActor]

    def get(self, request):
        if request.user.role == User.STUDENT:
            placements = InternshipPlacements.objects.filter(intern=request.user)
        elif request.user.role == User.ACADEMIC_SUPERVISOR:
            placements = InternshipPlacements.objects.filter(academic_supervisor=request.user)
        elif request.user.role == User.WORKPLACE_SUPERVISOR:
            placements = InternshipPlacements.objects.filter(workplace_supervisor=request.user)
        else:  # Admin
            placements = InternshipPlacements.objects.all()

        serializer = InternshipPlacementsSerializer(placements, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = InternshipPlacementsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            intern=request.user,
            institution_id=request.user.institution_id,
            programme_id=request.user.programme_id,
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class InternshipPlacementDetailView(APIView):
    permission_classes = [IsPlacementActor]

    def get_object(self, pk):
        try:
            return InternshipPlacements.objects.get(pk=pk)
        except InternshipPlacements.DoesNotExist:
            raise NotFound("Placement not found.")

    def _ensure_can_access(self, request, placement):
        if request.user.is_superuser or request.user.role == User.INTERNSHIP_ADMIN:
            return
        if placement.intern_id == request.user.id:
            return
        if placement.academic_supervisor_id == request.user.id:
            return
        if placement.workplace_supervisor_id == request.user.id:
            return
        raise PermissionDenied("You do not have permission to access this placement.")

    def get(self, request, pk):
        placement = self.get_object(pk)
        self._ensure_can_access(request, placement)
        serializer = InternshipPlacementsSerializer(placement)
        return Response(serializer.data)

    def put(self, request, pk):
        placement = self.get_object(pk)
        self._ensure_can_access(request, placement)
        self._check_locked(placement)
        serializer = InternshipPlacementsSerializer(placement, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def patch(self, request, pk):
        placement = self.get_object(pk)
        self._ensure_can_access(request, placement)
        self._check_locked(placement)
        serializer = InternshipPlacementsSerializer(placement, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        placement = self.get_object(pk)
        self._ensure_can_access(request, placement)
        placement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def _check_locked(self, placement):
        locked_statuses = ["approved", "active", "completed", "cancelled"]
        if placement.status in locked_statuses:
            raise ValidationError(
                {"error": f"Cannot modify placement once it is {placement.status}."}
            )


class PlacementSubmitView(APIView):
    permission_classes = [IsStudent]

    def post(self, request, pk):
        placement = self.get_object(pk)
        if request.user != placement.intern:
            return Response(
                {"error": "Only the assigned student can submit this placement."},
                status=status.HTTP_403_FORBIDDEN,
            )
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
        return Response(InternshipPlacementsSerializer(placement).data)

    def get_object(self, pk):
        try:
            return InternshipPlacements.objects.get(pk=pk)
        except InternshipPlacements.DoesNotExist:
            raise NotFound("Placement not found")


class PlacementApproveView(APIView):
    permission_classes = [IsAcademicSupervisor]

    def post(self, request, pk):
        placement = self.get_object(pk)

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

        return Response(InternshipPlacementsSerializer(placement).data)

    def get_object(self, pk):
        try:
            return InternshipPlacements.objects.get(pk=pk)
        except InternshipPlacements.DoesNotExist:
            raise NotFound("Placement not found")


class PlacementRejectView(APIView):
    permission_classes = [IsAcademicSupervisor]

    def post(self, request, pk):
        placement = self.get_object(pk)

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
        return Response(InternshipPlacementsSerializer(placement).data)

    def get_object(self, pk):
        try:
            return InternshipPlacements.objects.get(pk=pk)
        except InternshipPlacements.DoesNotExist:
            raise NotFound("Placement not found")


class PlacementActivateView(APIView):
    permission_classes = [IsAcademicSupervisor]

    def post(self, request, pk):
        placement = self.get_object(pk)

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
        return Response(InternshipPlacementsSerializer(placement).data)

    def get_object(self, pk):
        try:
            return InternshipPlacements.objects.get(pk=pk)
        except InternshipPlacements.DoesNotExist:
            raise NotFound("Placement not found")


class PlacementCompleteView(APIView):
    permission_classes = [IsAcademicSupervisor]

    def post(self, request, pk):
        placement = self.get_object(pk)

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
        return Response(InternshipPlacementsSerializer(placement).data)

    def get_object(self, pk):
        try:
            return InternshipPlacements.objects.get(pk=pk)
        except InternshipPlacements.DoesNotExist:
            raise NotFound("Placement not found")


class PlacementCancelView(APIView):
    permission_classes = [IsAcademicSupervisor]

    def post(self, request, pk):
        placement = self.get_object(pk)

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
        return Response(InternshipPlacementsSerializer(placement).data)

    def get_object(self, pk):
        try:
            return InternshipPlacements.objects.get(pk=pk)
        except InternshipPlacements.DoesNotExist:
            raise NotFound("Placement not found")


class PlacementAssignAcademicSupervisorView(APIView):
    permission_classes = [IsInternshipAdmin]

    def post(self, request, pk):
        placement = self.get_object(pk)
        user_id = request.data.get("user_id")

        if not user_id:
            return Response({"error": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        placement.academic_supervisor_id = user_id  # type: ignore
        placement.save()

        return Response({"message": "Academic supervisor assigned successfully."})

    def get_object(self, pk):
        try:
            return InternshipPlacements.objects.get(pk=pk)
        except InternshipPlacements.DoesNotExist:
            raise NotFound("Placement not found")


class PlacementAssignWorkplaceSupervisorView(APIView):
    permission_classes = [IsInternshipAdmin]

    def post(self, request, pk):
        placement = self.get_object(pk)
        user_id = request.data.get("user_id")

        if not user_id:
            return Response({"error": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        placement.workplace_supervisor_id = user_id  # type: ignore
        placement.save()

        return Response({"message": "Workplace supervisor assigned successfully."})

    def get_object(self, pk):
        try:
            return InternshipPlacements.objects.get(pk=pk)
        except InternshipPlacements.DoesNotExist:
            raise NotFound("Placement not found")
