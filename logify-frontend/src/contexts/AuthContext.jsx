import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../config/api.js";

const SESSION_STORAGE_KEY = "logify-auth-session";
const ROLE_TO_PATH = {
  student: "/student",
  internship_admin: "/admin",
  academic_supervisor: "/supervisor",
  workplace_supervisor: "/workplace-supervisor",
};

const AuthContext = createContext({});

const getStoredSession = () => {
  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

const persistSession = (session) => {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

const clearStoredSession = () => {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
};

const getRedirectPath = (role) => ROLE_TO_PATH[role] || "/";

const toSession = (response) => ({
  token: response.access,
  refreshToken: response.refresh,
  tokenType: "Bearer",
});

const toSupervisorPayload = (data) => {
  const trimmedName = data.fullName?.trim() || "";
  const [firstName = "", ...rest] = trimmedName.split(/\s+/);
  const lastName = rest.join(" ");

  return {
    email: data.email,
    password: data.password,
    role: data.role,
    first_name: data.firstName ?? firstName,
    last_name: data.lastName ?? lastName,
    phone: data.phone,
    staff_number: data.staffNumber,
    department: data.department,
    title: data.title,
  };
};

const toAdminPayload = (data) => {
  const trimmedName = data.fullName?.trim() || "";
  const [firstName = "", ...rest] = trimmedName.split(/\s+/);
  const lastName = rest.join(" ");

  return {
    email: data.email,
    password: data.password,
    first_name: data.firstName ?? firstName,
    last_name: data.lastName ?? lastName,
    phone: data.phone,
  };
};

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => getStoredSession());
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(Boolean(session?.token));

  useEffect(() => {
    const loadUser = async () => {
      if (!session?.token) {
        setUser(null);
        setIsLoadingUser(false);
        return;
      }

      setIsLoadingUser(true);

      try {
        const currentUser = await api.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load authenticated user:", error);
        setSession(null);
        setUser(null);
        clearStoredSession();
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [session?.token]);

  const login = async (email, password) => {
    try {
      const response = await api.auth.login({ email, password });
      const nextSession = toSession(response);

      persistSession(nextSession);
      setSession(nextSession);

      const currentUser = await api.auth.me();
      setUser(currentUser);

      navigate(getRedirectPath(currentUser?.role));
      return currentUser;
    } catch (error) {
      clearStoredSession();
      setSession(null);
      setUser(null);
      throw new Error(error.message || "Login failed. Please try again.");
    }
  };

  const studentSignup = async (data) => {
    try {
      return await api.auth.studentRequestOTP(data);
    } catch (error) {
      throw new Error(error.message || "Signup failed. Please try again.");
    }
  };

  const verifyStudentSignup = async (data) => {
    try {
      const response = await api.auth.studentVerifyOTP(data);
      const nextSession = toSession(response);

      persistSession(nextSession);
      setSession(nextSession);
      setUser(response.user ?? null);

      if (response.user?.role) {
        navigate(getRedirectPath(response.user.role));
      }

      return response;
    } catch (error) {
      throw new Error(
        error.message || "OTP verification failed. Please try again.",
      );
    }
  };

  const supervisorSignUp = async (data) => {
    try {
      return await api.auth.supervisorSignup(toSupervisorPayload(data));
    } catch (error) {
      throw new Error(error.message || "Supervisor failed to signup.");
    }
  };

  const adminSignUp = async (data) => {
    try {
      return await api.auth.adminSignup(toAdminPayload(data));
    } catch (error) {
      throw new Error(error.message || "Internship admin signup failed.");
    }
  };

  const logout = async () => {
    const refreshToken = session?.refreshToken;

    try {
      if (refreshToken) {
        await api.auth.logout({ refresh: refreshToken });
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setSession(null);
      setUser(null);
      clearStoredSession();
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token: session?.token ?? null,
        refreshToken: session?.refreshToken ?? null,
        tokenType: session?.tokenType ?? null,
        isAuthenticated: Boolean(session?.token),
        isLoadingUser,
        user,
        login,
        logout,
        studentSignup,
        verifyStudentSignup,
        supervisorSignUp,
        adminSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
