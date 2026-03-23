import { createContext, useContext, useCallback, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [userPreferences, setUserPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem("logify-user-prefs");
      return saved ? JSON.parse(saved) : { theme: "light" };
    } catch {
      return { theme: "light" };
    }
  });

  // Persist preferences to localStorage
  const updatePreferences = useCallback((prefs) => {
    setUserPreferences((prev) => {
      const updated = { ...prev, ...prefs };
      try {
        localStorage.setItem("logify-user-prefs", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save preferences:", err);
      }
      return updated;
    });
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = { id, ...notification };
    setNotifications((prev) => [...prev, newNotification]);

    // Auto-dismiss after duration
    if (notification.duration || notification.duration === undefined) {
      const duration = notification.duration || 3000;
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    sidebarOpen,
    setSidebarOpen,
    selectedSection,
    setSelectedSection,
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    userPreferences,
    updatePreferences,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook to access app context
 * @throws {Error} If used outside AppProvider
 * @returns {Object} App context value
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
