import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api, SESSION_CLEARED_EVENT } from "../config/api.js";
import Loading from "../components/ui/Loading";

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

const clearAuthState = ({ setSession, setUser, setIsLoadingUser }) => {
  clearStoredSession();
  setSession(null);
  setUser(null);
  setIsLoadingUser(false);
};

const toSupervisorPayload = (data) => {
  const trimmedName = data.fullName?.trim() || "";
  const [firstName = "", ...rest] = trimmedName.split(/\s+/);
  const lastName = rest.join(" ");

  const basePayload = {
    email: data.email,
    password: data.password,
    role: data.role,
    first_name: data.firstName ?? firstName,
    last_name: data.lastName ?? lastName,
    college_id: Number(data.college),
  };

  if (data.role === "academic_supervisor") {
    return {
      ...basePayload,
      department_id: Number(data.department),
    };
  }

  return {
    ...basePayload,
    organization_name: data.organization,
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
    college_id: Number(data.college),
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
      } catch {
        clearAuthState({ setSession, setUser, setIsLoadingUser });
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [session?.token]);

  useEffect(() => {
    const handleSessionCleared = () => {
      setSession(null);
      setUser(null);
      setIsLoadingUser(false);
    };

    window.addEventListener(SESSION_CLEARED_EVENT, handleSessionCleared);
    return () =>
      window.removeEventListener(SESSION_CLEARED_EVENT, handleSessionCleared);
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === SESSION_STORAGE_KEY) {
        const newSession = getStoredSession();
        setSession(newSession);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (email, password, redirectTo = null) => {
    try {
      setIsLoadingUser(true);
      const response = await api.auth.login({ email, password });
      const nextSession = toSession(response);

      persistSession(nextSession);
      setSession(nextSession);

      const currentUser = await api.auth.me();
      setUser(currentUser);

      navigate(redirectTo || getRedirectPath(currentUser?.role), {
        replace: true,
      });
      return currentUser;
    } catch (error) {
      clearAuthState({ setSession, setUser, setIsLoadingUser });
      throw new Error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoadingUser(false);
    }
  };

  const studentSignup = async (data) => {
    try {
      setIsLoadingUser(true);
      const response = await api.auth.studentSignup(data);
      const nextSession = toSession(response);

      persistSession(nextSession);
      setSession(nextSession);

      const currentUser = await api.auth.me();
      setUser(currentUser);

      navigate(getRedirectPath(currentUser?.role), { replace: true });
      return currentUser;
    } catch (error) {
      clearAuthState({ setSession, setUser, setIsLoadingUser });
      throw new Error(error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoadingUser(false);
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

  const logout = async (redirectTo = "/auth") => {
    const refreshToken = session?.refreshToken;

    try {
      if (refreshToken) {
        await api.auth.logout({ refresh: refreshToken });
      }
    } finally {
      clearAuthState({ setSession, setUser, setIsLoadingUser });
      navigate(redirectTo, { replace: true });
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
        supervisorSignUp,
        adminSignUp,
      }}
    >
      {isLoadingUser && <Loading />}
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
