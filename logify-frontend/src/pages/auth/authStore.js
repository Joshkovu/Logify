// Authentication Store - Production Ready
//
// This module handles user authentication with support for both:
// 1. Mock authentication (development/testing) - uses localStorage
// 2. Real API authentication (production) - connects to Django backend
//
// To toggle between modes, set VITE_USE_MOCK_AUTH=true in .env for development
// Leave unset or set to false for production API integration

import { api } from "../../config/api.js";

// Flag to toggle between mock and real authentication
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === "true";

// Mock data for development only - NOT used in production
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

export async function logout() {
  const session = getSession();
  if (session?.refreshToken) {
    try {
      // Call backend logout endpoint if available
      await api.auth.logout({ refresh: session.refreshToken });
    } catch (error) {
      // Ignore logout errors - session will be cleared locally anyway
      console.warn("Backend logout failed:", error);
    }
  }

  clearSession();
  return { ok: true };
}

export async function refreshToken() {
  const session = getSession();
  if (!session?.refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await api.auth.refresh({ refresh: session.refreshToken });

    const updatedSession = {
      ...session,
      token: response.access,
      refreshToken: response.refresh || session.refreshToken,
    };

    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(updatedSession),
    );

    return { ok: true, session: updatedSession };
  } catch (error) {
    // If refresh fails, clear session
    clearSession();
    throw new Error(
      `Token refresh failed: ${error.message || "Session expired. Please log in again."}`,
    );
  }
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

export async function authenticate({ email, password }) {
  if (USE_MOCK_AUTH) {
    // Use existing mock authentication for development
    return authenticateMock({ email, password });
  }

  // Use real backend API for production
  try {
    const response = await api.auth.login({ email, password });

    const session = {
      token: response.access,
      refreshToken: response.refresh,
      user: response.user,
      tokenType: "Bearer",
    };

    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    return {
      ok: true,
      session,
      redirectPath: roleHome(response.user.role),
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "Login failed. Please check your credentials.",
    };
  }
}

// Keep the original mock function for development
function authenticateMock({ email, password }) {
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
  // Admin registration is handled through Django admin interface
  // This function is for development/testing only
  if (!USE_MOCK_AUTH) {
    return {
      ok: false,
      error:
        "Admin registration is not available through the API. Please contact system administrator or use Django admin.",
    };
  }

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

export async function registerSupervisor({
  fullName,
  email,
  password,
  role,
  institutionOrOrganization,
}) {
  if (USE_MOCK_AUTH) {
    // Use existing mock registration for development
    return registerSupervisorMock({
      fullName,
      email,
      password,
      role,
      institutionOrOrganization,
    });
  }

  // Use real backend API for production
  try {
    const signupData = {
      email,
      password,
      first_name: fullName.split(" ")[0],
      last_name: fullName.split(" ").slice(1).join(" "),
      role,
      phone: "", // Add phone field if needed
    };

    await api.auth.supervisorSignup(signupData);

    return {
      ok: true,
      message:
        "Supervisor application submitted successfully. Your account is pending approval.",
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "Registration failed. Please try again.",
    };
  }
}

// Keep the original mock function for development
function registerSupervisorMock({
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

  if (
    !role ||
    !["academic_supervisor", "workplace_supervisor"].includes(role)
  ) {
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

export async function registerStudent({
  fullName,
  email,
  password,
  studentId,
  program,
  yearOfStudy,
}) {
  if (USE_MOCK_AUTH) {
    // Use existing mock registration for development
    return registerStudentMock({
      fullName,
      email,
      password,
      studentId,
      program,
      yearOfStudy,
    });
  }

  // Use real backend API for production - OTP-based registration
  try {
    // First request OTP
    await api.auth.studentRequestOTP({ email });

    return {
      ok: true,
      requiresOTP: true,
      message:
        "OTP sent to your email. Please verify to complete registration.",
      registrationData: {
        fullName,
        email,
        password,
        studentId,
        program,
        yearOfStudy,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "Failed to send OTP. Please try again.",
    };
  }
}

export async function verifyStudentOTP({ email, otp, registrationData }) {
  if (USE_MOCK_AUTH) {
    // For mock mode, just complete registration
    return registerStudentMock(registrationData);
  }

  // Use real backend API for production
  try {
    const signupData = {
      email,
      otp,
      password: registrationData.password,
      first_name: registrationData.fullName.split(" ")[0],
      last_name: registrationData.fullName.split(" ").slice(1).join(" "),
      student_id: registrationData.studentId,
      program: registrationData.program,
      year_of_study: registrationData.yearOfStudy,
    };

    await api.auth.studentVerifyOTP(signupData);

    return {
      ok: true,
      message: "Student registration successful. Welcome to Logify!",
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "OTP verification failed. Please try again.",
    };
  }
}

// Keep the original mock function for development
function registerStudentMock({
  fullName,
  email,
  password,
  studentId,
  program,
  yearOfStudy,
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

  if (!studentId?.trim()) {
    return {
      ok: false,
      error: "Student ID is required.",
    };
  }

  if (!program?.trim()) {
    return {
      ok: false,
      error: "Program is required.",
    };
  }

  if (!yearOfStudy) {
    return {
      ok: false,
      error: "Year of study is required.",
    };
  }

  const newUser = {
    id: Date.now(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
    role: "student",
    studentId: studentId.trim(),
    program: program.trim(),
    yearOfStudy: parseInt(yearOfStudy),
    status: "approved", // Students are auto-approved
  };

  writeUsers([...users, newUser]);
  return { ok: true };
}
