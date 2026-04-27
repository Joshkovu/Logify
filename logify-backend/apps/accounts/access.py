from __future__ import annotations

from typing import Optional

from apps.academics.models import Programmes

from .models import StaffProfiles, User


def get_user_institution_id(user: User) -> Optional[int]:
    """Resolve a user's institution from profile fields used across the app."""
    if user.institution_id:
        try:
            return int(user.institution_id)
        except (TypeError, ValueError):
            return None

    try:
        return user.staffprofiles.department.college.institution_id
    except StaffProfiles.DoesNotExist:
        return None


def is_user_in_institution(user: User, institution_id: int) -> bool:
    if str(user.institution_id) == str(institution_id):
        return True

    try:
        return user.staffprofiles.department.college.institution_id == institution_id
    except StaffProfiles.DoesNotExist:
        return False


def get_user_college_id(user: User) -> Optional[int]:
    """Resolve a user's college when they have a staff profile attached."""
    try:
        return int(user.staffprofiles.department.college_id)
    except (StaffProfiles.DoesNotExist, TypeError, ValueError, AttributeError):
        return None


def get_programme_ids_for_college(college_id: int) -> list[str]:
    """Return programme ids for a college as strings to match User.programme_id storage."""
    ids = Programmes.objects.filter(department__college_id=college_id).values_list("id", flat=True)
    return [str(i) for i in ids]


def is_user_in_admin_college_scope(
    target: User,
    admin_college_id: int,
    admin_institution_id: Optional[int],
) -> bool:
    """Check whether a target user is visible to a college-scoped internship admin."""
    if admin_institution_id is None:
        return False

    if str(target.institution_id) != str(admin_institution_id):
        return False

    if target.role == User.STUDENT:
        return str(target.programme_id) in get_programme_ids_for_college(admin_college_id)

    if target.role == User.ACADEMIC_SUPERVISOR:
        try:
            return int(target.staffprofiles.department.college_id) == int(admin_college_id)
        except (StaffProfiles.DoesNotExist, TypeError, ValueError, AttributeError):
            return False

    if target.role == User.WORKPLACE_SUPERVISOR:
        from apps.placements.models import InternshipPlacements

        programme_ids = get_programme_ids_for_college(admin_college_id)
        if not programme_ids:
            return False
        return InternshipPlacements.objects.filter(
            workplace_supervisor=target,
            institution_id=admin_institution_id,
            programme_id__in=programme_ids,
        ).exists()

    if target.role == User.INTERNSHIP_ADMIN:
        try:
            return int(target.staffprofiles.department.college_id) == int(admin_college_id)
        except (StaffProfiles.DoesNotExist, TypeError, ValueError, AttributeError):
            return False

    return False
