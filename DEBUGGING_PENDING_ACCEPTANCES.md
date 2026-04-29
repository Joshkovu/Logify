# Debugging: Pending Placements Not Showing for Workplace Supervisors

## Issues Found & Fixed

### ✅ Fixed Issue #1: API Data Parameter Bug
**File**: `logify-frontend/src/config/api.js`
- **Problem**: `wsDenyPlacement()` and `wsAcceptPlacement()` methods didn't accept data parameters
- **Solution**: Updated both methods to accept optional data and pass it to `apiRequest`
- **Impact**: Comments/reasons can now be properly sent when denying placements

---

## Diagnostic Steps to Identify Root Cause

### 1. **Check Database - Verify Placements Exist**
```bash
# SSH into your Django container and run:
python manage.py shell
```

Then in the Python shell:
```python
from apps.placements.models import InternshipPlacements
from apps.accounts.models import User

# Find a workplace supervisor (e.g., with email or first_name)
ws = User.objects.filter(role='workplace_supervisor').first()
print(f"Workplace Supervisor: {ws}")

# Check placements assigned to this supervisor
placements = InternshipPlacements.objects.filter(workplace_supervisor=ws)
print(f"Total placements for supervisor: {placements.count()}")

# Check placements in "approved" status
approved = placements.filter(status='approved')
print(f"Approved placements: {approved.count()}")

# Print details of approved placements
for p in approved:
    print(f"  - ID: {p.id}, Status: {p.status}, Intern: {p.intern.email}")
```

### 2. **Check Backend API Response**
```bash
# From your terminal, make a request:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/v1/placements/placements/
```

Look for:
- ✓ HTTP 200 response
- ✓ Array of placement objects in response
- ✓ Placements have `status: "approved"` and `workplace_supervisor` ID set

### 3. **Check Frontend Network Call**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to Pending Acceptances page
4. Look for request to `/v1/placements/placements/`
5. Check:
   - Response status is 200
   - Response body contains placements array
   - Placements have correct status values

### 4. **Verify Placement Workflow**
Check that placements are reaching "approved" status:

```python
# In Django shell:
from apps.placements.models import PlacementStatusHistory

# Check status history for a placement
placement = InternshipPlacements.objects.first()
history = PlacementStatusHistory.objects.filter(placement=placement).order_by('changed_at')
for h in history:
    print(f"{h.from_status} → {h.to_status} (by: {h.changed_by.email})")
```

Expected progression:
- draft → submitted (by student)
- submitted → approved (by academic supervisor)
- approved → active or rejected (by workplace supervisor)

### 5. **Check Workplace Supervisor Assignment**
```python
# In Django shell:
placement = InternshipPlacements.objects.filter(status='approved').first()
if placement:
    print(f"Placement: {placement.internship_title}")
    print(f"Workplace Supervisor: {placement.workplace_supervisor}")
    print(f"WS Email: {placement.workplace_supervisor.email if placement.workplace_supervisor else 'NOT SET'}")
    print(f"Current User vs WS: {request.user.id == placement.workplace_supervisor.id if placement.workplace_supervisor else 'N/A'}")
```

---

## Common Causes & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Empty pending list | Placements never reach "approved" status | Academic supervisors need to approve placements |
| Empty pending list | Placements aren't assigned to the supervisor | Check if `workplace_supervisor` is null on placements |
| Empty pending list | Different workplace supervisor logged in | Check logged-in user vs placements |
| API returns 403 | Permission denied | Check user role is "workplace_supervisor" |
| API returns 200 but no data | Placements filter doesn't work | Check SQL query in Django logs |
| Frontend shows "Loading..." forever | API request hanging | Check network tab, API response time |

---

## Logs to Check

### Django (Backend)
```bash
# Check Django logs for errors:
docker logs logify-backend 2>&1 | grep -i "error\|exception" | tail -20
```

### Network (Frontend)
1. DevTools → Network tab → Filter: `placements`
2. Check for:
   - ❌ 403 Forbidden - Permission issue
   - ❌ 500 Internal Server Error - Backend crash
   - ❌ Request timeout - Backend unresponsive
   - ✓ 200 OK with data - Working correctly

---

## Next Steps

1. Run the diagnostic steps above and share the findings
2. Check database to confirm placements exist in "approved" status
3. Verify network request is returning data
4. If no data is returned, check if placements are even being created and approved

The fix I applied should resolve the deny functionality issue, but we need to identify why approved placements aren't appearing in the first place.
