# Logify - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### Installation

```bash
cd logify-frontend
npm install
# or
pnpm install
```

### Running the Development Server

```bash
npm run dev
# Server will start at http://localhost:3000
```

### Building for Production

```bash
npm run build
npm run preview
```

---

## 👥 Test Accounts

The application comes pre-loaded with demo accounts for testing:

### Student Account
- **Email**: `student@students.mak.ac.ug`
- **Password**: (empty - no password required for demo)
- **Role**: Student
- **Features**: Can access student dashboard, submit weekly logs, view evaluations

### Internship Admin Account
- **Email**: `internship.admin@mak.ac.ug`
- **Password**: (empty - no password required for demo)
- **Role**: Admin
- **Features**: Can manage placements, approve logs, assign evaluations

### Academic Supervisor Account
- **Email**: `academic.supervisor@mak.ac.ug`
- **Password**: (empty - no password required for demo)
- **Role**: Academic Supervisor
- **Features**: Can evaluate students, approve applications

### Workplace Supervisor Account
- **Email**: `workplace.supervisor@fintech.co.ug`
- **Password**: (empty - no password required for demo)
- **Role**: Workplace Supervisor
- **Features**: Can supervise students at workplace, submit evaluations

---

## 📱 Features Overview

### For Students
✅ **Dashboard**: View internship overview and status
✅ **Internship Placement**: See placement details and supervisor information
✅ **Weekly Logs**: Submit and track weekly progress reports
✅ **Evaluations**: View performance evaluations
✅ **Profile**: Manage personal information and settings
✅ **Sign Out**: Securely log out from the system

### New Features Added
✅ **Student Signup**: Register as a new student with full details
✅ **Persistent Authentication**: Session persists across page reloads
✅ **Protected Routes**: Unauthorized users are redirected to login
✅ **Improved State Management**: Better data consistency across the app

---

## 🎯 User Flows

### New Student Registration Flow
1. Visit `/signup`
2. Click "Student" option
3. Fill in all student information:
   - Full Name
   - Email Address
   - Matriculation/Student ID
   - Educational Institution
   - Department
   - Password (min 8 characters)
4. Confirm password
5. Click "Create Student Account"
6. Redirected to login page
7. Log in with new credentials

### Student Login Flow
1. Visit `/login`
2. Enter email: `student@students.mak.ac.ug`
3. Leave password empty (demo mode)
4. Click "Login"
5. Redirected to student dashboard

### Navigating the Student Dashboard
1. **Dashboard**: Overview of internship progress
2. **Internship Placement**: Details about your placement site and supervisors
3. **Weekly Logs**: List of submitted weekly logs with status
   - Click "New Log" to submit a new log
   - Click "View Details" to see log content
4. **Evaluations**: View evaluations from supervisors
5. **Profile**: Update personal information and manage security
   - Click "Edit Profile" to update info
   - Click "Change Password" to change password
6. **Sign Out**: Logout and return to login page

---

## 🔑 Key Improvements

### State Management
- **AuthContext**: Manages user authentication and session
- **AppContext**: Manages app-wide UI state and preferences
- Session persists to localStorage automatically
- User data available across all components via hooks

### Performance
- Components memoized to prevent unnecessary re-renders
- Event handlers wrapped with useCallback for stability
- Computed values memoized with useMemo
- Optimized sidebar to prevent disappearing options

### Code Quality
- Utility functions for repeated logic
- Custom hooks (useForm, useAsync, useLocalStorage)
- Better error handling and validation
- Improved type safety with prop validation

---

## 🛠️ Architecture

```
App
├── AuthProvider (Authentication State)
│   ├── AppProvider (App UI State)
│   │   ├── Routes
│   │   ├── LandingPage
│   │   ├── LoginPage (uses useAuth hook)
│   │   ├── SignupRolePage
│   │   ├── StudentSignupPage (NEW)
│   │   ├── AdminSignupPage
│   │   ├── SupervisorSignupPage
│   │   └── Dashboards
│   │       ├── StudentDashboard (Protected)
│   │       │   ├── Sidebar (uses useAuth hook)
│   │       │   └── Pages
│   │       │       ├── Dashboard (uses useAuth)
│   │       │       ├── InternshipPlacement
│   │       │       ├── WeeklyLogs
│   │       │       ├── Evaluations
│   │       │       └── Profile (uses useAuth)
│   │       ├── AdminDashboard
│   │       └── SupervisorDashboard
```

---

## 📚 API Structure (Current Demo)

Currently using localStorage for authentication:

**Available Functions:**
- `authenticate(email, password)`: Login user
- `registerStudent(data)`: Register new student
- `registerAdmin(data)`: Register new admin
- `registerSupervisor(data)`: Register new supervisor
- `getSession()`: Get current session
- `clearSession()`: Clear session

**Future**: Replace with real API endpoints

---

## 🐛 Troubleshooting

### Issue: "Options disappear when selecting items"
**Status**: ✅ FIXED
- Sidebar is now memoized to prevent re-renders
- State properly managed with AuthContext
- Navigation persists state correctly

### Issue: "Session lost on page reload"
**Status**: ✅ FIXED
- AuthContext reads from localStorage on init
- Session automatically persists
- User stays logged in after refresh

### Issue: "Can't see user name in sidebar"
**Status**: ✅ FIXED
- Dynamic user initials computed from login
- Sidebar displays actual logged-in user name
- Falls back to "U" if no user data

### Issue: "Logout doesn't work"
**Status**: ✅ FIXED
- Proper logout function clears session
- Automatically redirects to home
- Session cleared from localStorage

---

## 🔄 Development Tips

### Adding New Pages
1. Create page component in `src/pages/`
2. Import in `src/App.jsx`
3. Add route in Routes section
4. If protected, wrap with auth check

### Using Authentication in Components
```jsx
import { useAuth } from "./contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return <div>Hello {user.fullName}</div>;
}
```

### Using App State
```jsx
import { useApp } from "./contexts/AppContext";

function MyComponent() {
  const { addNotification, userPreferences } = useApp();
  
  const notify = () => {
    addNotification({
      type: "success",
      message: "Success!",
      duration: 3000,
    });
  };
}
```

### Using Forms
```jsx
import { useForm } from "./hooks/useForm";

function MyForm() {
  const form = useForm(
    { name: "", email: "" },
    async (values) => {
      // Handle submission
    }
  );
  
  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.getFieldProps("name")} />
      {form.errors.name && <span>{form.errors.name}</span>}
    </form>
  );
}
```

---

## 📊 File Structure Reference

```
logify-frontend/
├── src/
│   ├── contexts/
│   │   ├── AuthContext.jsx        (NEW)
│   │   └── AppContext.jsx         (NEW)
│   ├── hooks/
│   │   └── useForm.js             (NEW)
│   ├── lib/
│   │   └── utils.js               (ENHANCED)
│   ├── pages/
│   │   ├── StudentSignupPage.jsx  (NEW)
│   │   ├── LoginPage.jsx          (UPDATED)
│   │   ├── SignupRolePage.jsx     (UPDATED)
│   │   └── dashboards/
│   │       └── StudentDashboard/
│   │           ├── StudentDashboard.jsx (UPDATED)
│   │           ├── Sidebar.jsx         (UPDATED)
│   │           └── pages/
│   │               ├── Dashboard.jsx (UPDATED)
│   │               ├── WeeklyLogs.jsx (UPDATED)
│   │               ├── Profile.jsx    (UPDATED)
│   │               └── ...
│   ├── components/
│   ├── assets/
│   ├── App.jsx         (UPDATED)
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
├── REFACTORING_IMPROVEMENTS.md (NEW)
└── README.md
```

---

## 🚨 Important Notes

### For Backend Integration
When integrating with backend:
1. Update `authenticat()` function in `authStore.js` to call API
2. Replace localStorage with JWT tokens
3. Update `registerStudent()` and other functions to call API
4. Consider adding refresh token logic
5. Add request/response interceptors

### Security Considerations
- Change demo account setup before production
- Implement proper password hashing on backend
- Use HTTPS in production
- Consider CORS configuration
- Implement rate limiting on auth endpoints
- Use secure cookies for JWT storage

---

## 📞 Support

For issues or questions:
1. Check REFACTORING_IMPROVEMENTS.md for detailed documentation
2. Review test account credentials
3. Check browser console for error messages
4. Verify all dependencies are installed

---

**Version**: 1.0.0
**Last Updated**: March 23, 2026
**Status**: ✅ Ready for Testing
