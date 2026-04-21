## Implementation Notes

### Overview
This implementation adds real login/auth support to the Logify frontend and backend

---

## Backend Changes

### New auth endpoints
Added `/accounts/login/`, `/accounts/logout/`, and `/accounts/me/` in views.py and urls.py.

- `POST /accounts/login/`
  - authenticates with Django `authenticate()`
  - logs in with `login(request, user)`
  - returns minimal user data: `email`, `role`, `first_name`, `last_name`

- `POST /accounts/logout/`
  - calls Django `logout(request)`

- `GET /accounts/me/`
  - returns current authenticated user or `401` if not logged in

### URL registration
- Registered `accounts` routes in urls.py

---

## Frontend Changes

### Login flow
Created LoginPage.jsx with:

- email/password form
- POST to `/accounts/login/`
- `credentials: "include"` for session auth
- error state handling
- redirect after login using returned `role`

### Auth storage
auth.js now:
- stores `auth_user` in `localStorage`
- reads auth state
- clears auth on logout

### Route protection
ProtectedRoute.jsx:
- checks `auth_user`
- redirects unauthenticated users to `/login`
- redirects wrong-role users to `/unauthorized`

### Routing updates
App.jsx:
- added `/login`
- kept dashboard routes for:
  - `/student/*`
  - `/admin/*`
  - `/supervisor/*`
- mapped role protection to backend role strings:
  - `student`
  - `internship_admin`
  - `academic_supervisor`

### Landing page
LandingPage.jsx:
- portal cards now link to `/login?role=...`
- login page uses query fallback to infer intended portal destination

### Frontend proxy
vite.config.js configured proxy for:
- `/accounts`
- `/logbook`

---

## Behavior

- Landing page portal cards start login flow
- Login is handled by backend
- Backend session persists if server is running
- Successful login stores user info locally
- Protected routes enforce auth and role
- Sign-out clears local auth state and returns home

