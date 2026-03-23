const USERS_STORAGE_KEY = "logify-auth-users";
const SESSION_STORAGE_KEY = "logify-auth-session";

const PREAUTHORIZED_ADMIN_EMAILS = [
  "internship.admin@mak.ac.ug",
  "dean.internships@mak.ac.ug",
  "placements.office@mak.ac.ug",
];

// Demo credentials for development/testing only
// These should be replaced with actual backend authentication
// Do NOT use in production
const seedUsers = [
  {
    id: 1,
    fullName: "Asha Nankya",
    email: "student@students.mak.ac.ug",
    password: "", // Use placeholder - connect to backend for real auth
    role: "student",
    status: "approved",
  },
  {
    id: 2,
    fullName: "Dr. Peter Kato",
    email: "academic.supervisor@mak.ac.ug",
    password: "", // Use placeholder - connect to backend for real auth
    role: "academic_supervisor",
    institutionOrOrganization: "Makerere University",
    status: "approved",
  },
  {
    id: 3,
    fullName: "Joy Namutebi",
    email: "workplace.supervisor@fintech.co.ug",
    password: "", // Use placeholder - connect to backend for real auth
    role: "workplace_supervisor",
    institutionOrOrganization: "FinTech Kampala",
    status: "approved",
  },
  {
    id: 4,
    fullName: "Mark Ssembatya",
    email: "internship.admin@mak.ac.ug",
    password: "", // Use placeholder - connect to backend for real auth
    role: "internship_admin",
    status: "approved",
  },
];

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function readUsers() {
  const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
}

function writeUsers(users) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getUsers() {
  return readUsers();
}

export function getSession() {
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

function roleHome(role) {
  if (role === "internship_admin") {
    return "/admin";
  }
  if (role === "student") {
    return "/student";
  }
  if (role === "academic_supervisor" || role === "workplace_supervisor") {
    return "/supervisor";
  }
  return "/";
}

export function authenticate({ email, password }) {
  const users = readUsers();
  const normalized = normalizeEmail(email);
  const user = users.find((item) => item.email === normalized);

  if (!user || user.password !== password) {
    return {
      ok: false,
      error: "Invalid credentials. Please check your email and password.",
    };
  }

  if (user.status === "pending_approval") {
    return {
      ok: false,
      error:
        "Your account is pending approval by an Internship Admin. You cannot log in yet.",
    };
  }

  const token = `ui-token-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const session = {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    tokenType: "Bearer",
  };

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

  return {
    ok: true,
    session,
    redirectPath: roleHome(user.role),
  };
}

export function validateCommonSignupFields({
  fullName,
  email,
  password,
  confirmPassword,
}) {
  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email || "")) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function registerAdmin({ fullName, email, password }) {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);

  if (users.some((user) => user.email === normalizedEmail)) {
    return {
      ok: false,
      error:
        "This email is already registered. If you are a returning user, use Login instead.",
    };
  }

  if (!PREAUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail)) {
    return {
      ok: false,
      error:
        "Admin signup is restricted. This email is not pre-authorized for Internship Admin access.",
    };
  }

  const newUser = {
    id: Date.now(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
    role: "internship_admin",
    status: "approved",
  };

  writeUsers([...users, newUser]);
  return { ok: true };
}

export function registerSupervisor({
  fullName,
  email,
  password,
  role,
  institutionOrOrganization,
}) {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);

  if (users.some((user) => user.email === normalizedEmail)) {
    return {
      ok: false,
      error:
        "This email is already registered. If you are a returning user, use Login instead.",
    };
  }

  if (!role || !["academic_supervisor", "workplace_supervisor"].includes(role)) {
    return {
      ok: false,
      error: "Please select a valid supervisor role.",
    };
  }

  if (!institutionOrOrganization.trim()) {
    return {
      ok: false,
      error: "Organization or institution is required.",
    };
  }

  const newUser = {
    id: Date.now(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
    role,
    institutionOrOrganization: institutionOrOrganization.trim(),
    status: "pending_approval",
  };

  writeUsers([...users, newUser]);
  return { ok: true };
}

export function registerStudent({
  fullName,
  email,
  password,
  matriculationNumber,
  institution,
  department,
}) {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);

  if (users.some((user) => user.email === normalizedEmail)) {
    return {
      ok: false,
      error:
        "This email is already registered. If you are a returning user, use Login instead.",
    };
  }

  if (!matriculationNumber.trim()) {
    return {
      ok: false,
      error: "Matriculation/Student ID is required.",
    };
  }

  if (!institution.trim()) {
    return {
      ok: false,
      error: "Educational institution is required.",
    };
  }

  if (!department.trim()) {
    return {
      ok: false,
      error: "Department is required.",
    };
  }

  const newUser = {
    id: Date.now(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
    role: "student",
    matriculationNumber: matriculationNumber.trim(),
    institution: institution.trim(),
    department: department.trim(),
    status: "approved",
  };

  writeUsers([...users, newUser]);
  return { ok: true };
}
