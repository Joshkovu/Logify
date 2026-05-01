from apps.notifications.emails import send_logify_email
from apps.placements.models import InternshipPlacements
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken  # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView  # type: ignore

from .access import (
    get_programme_ids_for_college,
    get_user_college_id,
    get_user_institution_id,
    is_user_in_admin_college_scope,
    is_user_in_institution,
)
from .models import SupervisorApplication, User
from .permissions import IsInternshipAdmin
from .serializers import (
    AdminSignupSerializer,
    ChangePasswordSerializer,
    MeUpdateSerializer,
    SupervisorApplicationSerializer,
    SupervisorSignupSerializer,
    UserDetailSerializer,
)


class AdminSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_logify_email(
                subject="Logify - Internship Admin Account",
                template_name="notifications/welcome.html",
                context={"user": user},
                recipient_list=[user.email],
            )
            return Response(
                {"message": "Internship admin account created successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupervisorSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SupervisorSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_logify_email(
                subject="Logify - Supervisor Account Application",
                template_name="notifications/supervisor_signup.html",
                context={"user": user},
                recipient_list=[user.email],
            )

            return Response(
                {"message": "Application received. Your account is inactive until approved."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupervisorApprovalView(APIView):
    permission_classes = [IsAuthenticated, IsInternshipAdmin]

    def post(self, request, application_id):
        application = get_object_or_404(SupervisorApplication, id=application_id)

        if not request.user.is_superuser and request.user.role == User.INTERNSHIP_ADMIN:
            institution_id = get_user_institution_id(request.user)
            if institution_id is None or not is_user_in_institution(
                application.user, institution_id
            ):
                raise PermissionDenied(
                    "You can only manage supervisor applications in your institution."
                )

        action = request.data.get("action")

        if action == "approve":
            application.status = "approved"
            application.save()
            user = application.user
            user.is_active = True
            user.save()
            send_logify_email(
                subject="Logify - Supervisor Account Application Approved",
                template_name="notifications/supervisor_approval.html",
                context={"user": user},
                recipient_list=[user.email],
            )
            return Response({"message": "Supervisor approved and account activated."})

        elif action == "reject":
            application.status = "rejected"
            application.save()
            return Response({"message": "Supervisor application rejected."})

        return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)


class SupervisorApplicationListView(ListAPIView):
    permission_classes = [IsAuthenticated, IsInternshipAdmin]
    serializer_class = SupervisorApplicationSerializer

    def get_queryset(self):
        queryset = SupervisorApplication.objects.select_related(
            "user", "user__staffprofiles", "user__staffprofiles__department"
        ).order_by("-created_at")

        user = self.request.user
        if not user.is_superuser:
            institution_id = get_user_institution_id(user)
            if institution_id is None:
                return queryset.none()
            queryset = queryset.filter(
                Q(user__institution_id=str(institution_id))
                | Q(user__staffprofiles__department__college__institution_id=institution_id)
            ).distinct()

        status_filter = self.request.query_params.get("status")  # type: ignore
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        college_id = self.request.query_params.get("college_id")
        if college_id:
            queryset = queryset.filter(user__staffprofiles__department__college_id=college_id)

        return queryset


class SupervisorListView(ListAPIView):
    permission_classes = [IsAuthenticated, IsInternshipAdmin]
    serializer_class = UserDetailSerializer

    def get_queryset(self):
        queryset = User.objects.filter(
            role__in=[User.ACADEMIC_SUPERVISOR, User.WORKPLACE_SUPERVISOR]
        ).select_related("staffprofiles", "staffprofiles__department")

        user = self.request.user
        if not user.is_superuser:
            institution_id = get_user_institution_id(user)
            admin_college_id = get_user_college_id(user)
            if institution_id is None or admin_college_id is None:
                return User.objects.none()

            academic_supervisors = queryset.filter(
                role=User.ACADEMIC_SUPERVISOR,
                institution_id=str(institution_id),
                staffprofiles__department__college_id=admin_college_id,
            )
            workplace_supervisors = queryset.filter(
                role=User.WORKPLACE_SUPERVISOR,
                workplace_supervisor__institution_id=institution_id,
                workplace_supervisor__programme_id__in=get_programme_ids_for_college(
                    admin_college_id
                ),
            )
            queryset = (academic_supervisors | workplace_supervisors).distinct()

        college_id = self.request.query_params.get("college_id")
        if college_id:
            if not user.is_superuser:
                admin_college_id = get_user_college_id(user)
                if admin_college_id is None or str(college_id) != str(admin_college_id):
                    return User.objects.none()
            queryset = queryset.filter(staffprofiles__department__college_id=college_id)

        return queryset


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = MeUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserDetailSerializer(user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Password updated successfully."}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            # Custom logic if needed after successful login
            pass
        return response


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = self.get_object(pk)
        serializer = UserDetailSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_object(self, pk):
        try:
            target = User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound("User not found.")

        requester = self.request.user
        if requester.is_superuser or requester.id == target.id:
            return target

        if requester.role == User.STUDENT:
            is_assigned = (
                InternshipPlacements.objects.filter(intern=requester)
                .filter(Q(academic_supervisor=target) | Q(workplace_supervisor=target))
                .exists()
            )
            if is_assigned:
                return target
            raise PermissionDenied("You can only view your assigned supervisors.")

        if requester.role == User.WORKPLACE_SUPERVISOR:
            is_assigned = (
                InternshipPlacements.objects.filter(workplace_supervisor=requester)
                .filter(intern=target)
                .exists()
            )
            if is_assigned:
                return target
            raise PermissionDenied("You can only view interns assigned to you.")

        if requester.role == User.ACADEMIC_SUPERVISOR:
            is_assigned = (
                InternshipPlacements.objects.filter(academic_supervisor=requester)
                .filter(intern=target)
                .exists()
            )
            if is_assigned:
                return target
            raise PermissionDenied("You can only view interns assigned to you.")
        if requester.role == User.ACADEMIC_SUPERVISOR:
            if target.role == User.STUDENT:
                if InternshipPlacements.objects.filter(
                    intern=target,
                    academic_supervisor=requester,
                ).exists():
                    return target
                raise PermissionDenied("You can only view your assigned students.")

            if target.role == User.WORKPLACE_SUPERVISOR:
                if InternshipPlacements.objects.filter(
                    academic_supervisor=requester,
                    workplace_supervisor=target,
                ).exists():
                    return target
                raise PermissionDenied(
                    "You can only view workplace supervisors assigned to your placements."
                )

            raise PermissionDenied(
                "You can only view your assigned students or workplace supervisors."
            )

        if requester.role == User.WORKPLACE_SUPERVISOR:
            if target.role == User.STUDENT:
                if InternshipPlacements.objects.filter(
                    intern=target,
                    workplace_supervisor=requester,
                ).exists():
                    return target
                raise PermissionDenied("You can only view your assigned students.")

            if target.role == User.ACADEMIC_SUPERVISOR:
                if InternshipPlacements.objects.filter(
                    workplace_supervisor=requester,
                    academic_supervisor=target,
                ).exists():
                    return target
                raise PermissionDenied(
                    "You can only view academic supervisors assigned to your placements."
                )

            raise PermissionDenied(
                "You can only view your assigned students or academic supervisors."
            )

        if requester.role != User.INTERNSHIP_ADMIN:
            raise PermissionDenied("You do not have permission to access this user.")

        institution_id = get_user_institution_id(requester)
        if institution_id is None or not is_user_in_institution(target, institution_id):
            raise PermissionDenied("You can only access users in your institution.")

        admin_college_id = get_user_college_id(requester)
        if admin_college_id is None:
            raise PermissionDenied("Your account must be assigned to a college.")

        if not is_user_in_admin_college_scope(target, admin_college_id, institution_id):
            raise PermissionDenied("You can only access users in your college scope.")

        return target

    def delete(self, request, pk):
        if request.user.role != User.INTERNSHIP_ADMIN and not request.user.is_superuser:
            return Response(
                {"error": "Only internship administrators can delete users."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
