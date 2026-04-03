import { getSession } from "@/pages/auth/authStore";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => {
  const session = getSession();
  return session
    ? {
        Authorization: `${session.tokenType} ${session.token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };
  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.text();

      let errorMessage = `HTTP ${response.status}`;
      try {
        const parsed = JSON.parse(errorData);
        errorMessage = parsed.detail || parsed.message || errorData;
      } catch {
        errorMessage = errorData;
      }
      throw new Error(errorMessage);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("API request failed:", err);
    throw err;
  }
};

export const api = {
  auth: {
    login: (data) =>
      apiRequest("/v1/auth/login/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: (data) =>
      apiRequest("/v1/auth/logout/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    refresh: (data) =>
      apiRequest("/v1/auth/refresh/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () => apiRequest("/v1/auth/me/"),
    supervisorSignup: (data) =>
      apiRequest("/v1/auth/supervisor/signup/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  academics: {
    getInstitutions: () => apiRequest("/v1/academics/institutions"),
    getInstitution: (id) => apiRequest(`/v1/academics/institutions/${id}/`),

    getDepartments: () => apiRequest("/v1/academics/departments/"),
    getDepartment: (id) => apiRequest(`/v1/academics/departments/${id}`),
    getInstitutionDepartments: (institutionId) =>
      apiRequest(`/v1/academics/institutions/${institutionId}/departments/`),

    getProgrammes: () => apiRequest("/v1/academics/programmes/"),
    getProgramme: (id) => apiRequest(`/v1/academics/programmes/${id}`),
    getDepartmentProgrammes: (departmentId) =>
      apiRequest(`/v1/academics/departments/${departmentId}/programmes/`),
  },
};
