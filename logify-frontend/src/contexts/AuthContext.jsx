import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getSession, clearSession } from "../pages/auth/authStore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session from localStorage on mount
  useEffect(() => {
    try {
      const savedSession = getSession();
      setSession(savedSession);
    } catch (err) {
      setError(err.message);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((newSession) => {
    try {
      setSession(newSession);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      clearSession();
      setSession(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const updateUser = useCallback((userData) => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        user: { ...prev.user, ...userData },
      };
    });
  }, []);

  const isAuthenticated = !!session;
  const user = session?.user || null;

  const value = {
    session,
    isAuthenticated,
    isLoading,
    error,
    user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access authentication context
 * @throws {Error} If used outside AuthProvider
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
