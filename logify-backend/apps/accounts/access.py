from __future__ import annotations

from typing import Optional

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
