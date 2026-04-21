export const getAuthUser = () => {
  const raw = localStorage.getItem("auth_user");

  if (!raw) {
    return { isAuthenticated: false, user: null, role: null };
  }

  try {
    const user = JSON.parse(raw);
    return {
      isAuthenticated: Boolean(user && user.role),
      user,
      role: user?.role || null,
    };
  } catch (error) {
    console.error("Failed to parse auth_user from localStorage", error);
    return { isAuthenticated: false, user: null, role: null };
  }
};

export const setAuthUser = (user) => {
  localStorage.setItem("auth_user", JSON.stringify(user));
};

export const clearAuthUser = () => {
  localStorage.removeItem("auth_user");
};
