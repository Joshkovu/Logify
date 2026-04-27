const rawApiBaseUrl = import.meta.env.VITE_BACKEND_URL;

if (!rawApiBaseUrl) {
  throw new Error(
    "VITE_BACKEND_URL is not defined. Set it to your backend API base URL,",
  );
}

const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

const SESSION_STORAGE_KEY = "logify-auth-session";
const SESSION_CLEARED_EVENT = "logify:session-cleared";
let refreshPromise = null;

const getErrorMessage = (parsedError, fallbackText) => {
  if (!parsedError) return fallbackText;
  if (typeof parsedError === "string") return parsedError;
  if (parsedError.detail) return parsedError.detail;
  if (parsedError.message) return parsedError.message;
  if (parsedError.error) return parsedError.error;

  const firstValue = Object.values(parsedError)[0];
  if (Array.isArray(firstValue) && firstValue.length > 0) {
    return firstValue[0];
  }
  if (typeof firstValue === "string") {
    return firstValue;
  }

  return fallbackText;
};

const getSession = () => {
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

const persistSession = (session) => {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

const clearSession = () => {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  window.dispatchEvent(new Event(SESSION_CLEARED_EVENT));
};

const getAuthHeaders = (session = getSession()) => ({
  ...(session?.token
    ? { Authorization: `${session.tokenType || "Bearer"} ${session.token}` }
    : {}),
  "Content-Type": "application/json",
});

const refreshSession = async () => {
  const session = getSession();
  if (!session?.refreshToken) {
    clearSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/v1/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: session.refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        const nextSession = {
          ...session,
          token: data.access,
          refreshToken: data.refresh || session.refreshToken,
          tokenType: session.tokenType || "Bearer",
        };
        persistSession(nextSession);
        return nextSession;
      })
      .catch((error) => {
        clearSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const apiRequest = async (
  endpoint,
  options = {},
  retryOnAuthFailure = true,
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const session = getSession();
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(session),
      ...options.headers,
    },
  };
  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.text();

    if (
      response.status === 401 &&
      retryOnAuthFailure &&
      session?.refreshToken
    ) {
      try {
        const nextSession = await refreshSession();
        if (nextSession?.token) {
          return apiRequest(
            endpoint,
            {
              ...options,
              headers: {
                ...getAuthHeaders(nextSession),
                ...options.headers,
              },
            },
            false,
          );
        }
      } catch {
        // Continue to the parsed error handling below.
      }
    }

    if (response.status === 401) {
      clearSession();
    }

    let errorMessage = `HTTP ${response.status}`;
    try {
      const parsed = JSON.parse(errorData);
      errorMessage = getErrorMessage(parsed, errorData);
    } catch {
      errorMessage = errorData;
    }
    throw new Error(errorMessage);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

const apiDownload = async (
  endpoint,
  options = {},
  retryOnAuthFailure = true,
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const session = getSession();
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(session),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401 && retryOnAuthFailure && session?.refreshToken) {
    try {
      const nextSession = await refreshSession();
      if (nextSession?.token) {
        return apiDownload(
          endpoint,
          {
            ...options,
            headers: {
              ...getAuthHeaders(nextSession),
              ...options.headers,
            },
          },
          false,
        );
      }
    } catch {
      clearSession();
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }

  return {
    blob: await response.blob(),
    contentType: response.headers.get("Content-Type"),
    contentDisposition: response.headers.get("Content-Disposition"),
  };
};

export { SESSION_CLEARED_EVENT };

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
    updateMe: (data) =>
      apiRequest("/v1/auth/me/", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    changePassword: (data) =>
      apiRequest("/v1/auth/change-password/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    adminSignup: (data) =>
      apiRequest("/v1/auth/admin/signup/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    supervisorSignup: (data) =>
      apiRequest("/v1/auth/supervisor/signup/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    studentSignup: (data) =>
      apiRequest("/v1/auth/student/signup/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  accounts: {
    getAcademicSupervisor: (id) => apiRequest(`/v1/accounts/users/${id}/`),
    getWorkplaceSupervisor: (id) => apiRequest(`/v1/accounts/users/${id}/`),
    getUser: (id) => apiRequest(`/v1/accounts/users/${id}/`),
    getSupervisorApplications: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/v1/accounts/supervisor/applications/${queryString ? `?${queryString}` : ""}`;
      return apiRequest(endpoint);
    },
    approveSupervisor: (applicationId, data) =>
      apiRequest(`/v1/accounts/supervisor/approve/${applicationId}/`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    reviewSupervisorApplication: (applicationId, action) =>
      apiRequest(`/v1/accounts/supervisor/approve/${applicationId}/`, {
        method: "POST",
        body: JSON.stringify({ action }),
      }),
  },

  academics: {
    getInstitutions: () => apiRequest("/v1/academics/institutions/"),
    getInstitution: (id) => apiRequest(`/v1/academics/institutions/${id}/`),
    createInstitution: (data) =>
      apiRequest(`/v1/academics/institutions/`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateInstitution: (id, data) =>
      apiRequest(`/v1/academics/institutions/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    patchInstitution: (id, data) =>
      apiRequest(`/v1/academics/institutions/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteInstitution: (id) =>
      apiRequest(`/v1/academics/institutions/${id}/`, { method: "DELETE" }),

    getDepartments: () => apiRequest("/v1/academics/departments/"),
    getDepartment: (id) => apiRequest(`/v1/academics/departments/${id}/`),
    createDepartment: (data) =>
      apiRequest(`/v1/academics/departments/`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateDepartment: (id, data) =>
      apiRequest(`/v1/academics/departments/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    patchDepartment: (id, data) =>
      apiRequest(`/v1/academics/departments/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteDepartment: (id) =>
      apiRequest(`/v1/academics/departments/${id}/`, { method: "DELETE" }),

    getInstitutionDepartments: (institutionId) =>
      apiRequest(`/v1/academics/institutions/${institutionId}/departments/`),

    getProgrammes: () => apiRequest("/v1/academics/programmes/"),
    getProgramme: (id) => apiRequest(`/v1/academics/programmes/${id}/`),
    createProgramme: (data) =>
      apiRequest(`/v1/academics/programmes/`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateProgramme: (id, data) =>
      apiRequest(`/v1/academics/programmes/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    patchProgramme: (id, data) =>
      apiRequest(`/v1/academics/programmes/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteProgramme: (id) =>
      apiRequest(`/v1/academics/programmes/${id}/`, { method: "DELETE" }),

    getDepartmentProgrammes: (departmentId) =>
      apiRequest(`/v1/academics/departments/${departmentId}/programmes/`),
  },

  placements: {
    getPlacements: () => apiRequest("/v1/placements/placements/"),
    getPlacement: (id) => apiRequest(`/v1/placements/placements/${id}/`),
    createPlacement: (data) =>
      apiRequest(`/v1/placements/placements/`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updatePlacement: (id, data) =>
      apiRequest(`/v1/placements/placements/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    patchPlacement: (id, data) =>
      apiRequest(`/v1/placements/placements/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    submitPlacement: (id) =>
      apiRequest(`/v1/placements/placements/${id}/submit/`, { method: "POST" }),
    approvePlacement: (id) =>
      apiRequest(`/v1/placements/placements/${id}/approve/`, {
        method: "POST",
      }),
    rejectPlacement: (id) =>
      apiRequest(`/v1/placements/placements/${id}/reject/`, { method: "POST" }),
    activatePlacement: (id) =>
      apiRequest(`/v1/placements/placements/${id}/activate/`, {
        method: "POST",
      }),
    completePlacement: (id) =>
      apiRequest(`/v1/placements/placements/${id}/complete/`, {
        method: "POST",
      }),
    cancelPlacement: (id) =>
      apiRequest(`/v1/placements/placements/${id}/cancel/`, { method: "POST" }),
  },

  logbook: {
    createWeeklyLog: (data) =>
      apiRequest("/v1/logbook/create_weekly_log/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateWeeklyLog: (id, data) =>
      apiRequest(`/v1/logbook/update_weekly_log/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    patchWeeklyLog: (id, data) =>
      apiRequest(`/v1/logbook/update_weekly_log/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    submitWeeklyLog: (id) =>
      apiRequest(`/v1/logbook/submit_weekly_log/${id}/`, { method: "POST" }),
    approveWeeklyLog: (id, data = {}) =>
      apiRequest(`/v1/logbook/approve_weekly_log/${id}/`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    rejectWeeklyLog: (id, data = {}) =>
      apiRequest(`/v1/logbook/reject_weekly_log/${id}/`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    requestChangesWeeklyLog: (id, data) =>
      apiRequest(`/v1/logbook/request_changes_weekly_log/${id}/`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getWeeklyLogs: () => apiRequest("/v1/logbook/weekly_logs/"),
    getWeeklyLog: (id) => apiRequest(`/v1/logbook/weekly_log_status/${id}/`),
    getWeeklyLogHistory: () => apiRequest(`/v1/logbook/history/`),
    deleteWeeklyLog: (id) =>
      apiRequest(`/v1/logbook/delete_weekly_log/${id}/`, { method: "DELETE" }),

    getWeeklyLogReviews: (id) =>
      apiRequest(`/v1/logbook/weekly_log_reviews/${id}/`),
  },

  organizations: {
    getOrganizations: () => apiRequest("/v1/organizations/organizations/"),
    getOrganization: (id) =>
      apiRequest(`/v1/organizations/organizations/${id}/`),
    createOrganization: (data) =>
      apiRequest("/v1/organizations/organizations/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateOrganization: (id, data) =>
      apiRequest(`/v1/organizations/organizations/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    patchOrganization: (id, data) =>
      apiRequest(`/v1/organizations/organizations/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteOrganization: (id) =>
      apiRequest(`/v1/organizations/organizations/${id}/`, {
        method: "DELETE",
      }),
  },

  reports: {
    getReport: (studentId, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/v1/reports/weekly_logs_report/${studentId}/${queryString ? "?" + queryString : ""}`;
      return apiRequest(endpoint);
    },
    downloadReport: (studentId, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/v1/reports/weekly_logs_report/${studentId}/${queryString ? "?" + queryString : ""}`;
      return apiDownload(endpoint);
    },
  },

  evaluations: {
    getResults: () => apiRequest("/v1/evaluations/results/"),
    getResult: (id) => apiRequest(`/v1/evaluations/results/${id}/`),
    createResult: (data) =>
      apiRequest("/v1/evaluations/results/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateResult: (id, data) =>
      apiRequest(`/v1/evaluations/results/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    patchResult: (id, data) =>
      apiRequest(`/v1/evaluations/results/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    getRubrics: () => apiRequest("/v1/evaluations/rubrics/"),
    getRubric: (id) => apiRequest(`/v1/evaluations/rubrics/${id}/`),
    createRubric: (data) =>
      apiRequest("/v1/evaluations/rubrics/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateRubric: (id, data) =>
      apiRequest(`/v1/evaluations/rubrics/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    patchRubric: (id, data) =>
      apiRequest(`/v1/evaluations/rubrics/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteRubric: (id) =>
      apiRequest(`/v1/evaluations/rubrics/${id}/`, { method: "DELETE" }),

    getCriteria: () => apiRequest("/v1/evaluations/criteria/"),
    getCriterion: (id) => apiRequest(`/v1/evaluations/criteria/${id}/`),
    createCriterion: (data) =>
      apiRequest("/v1/evaluations/criteria/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateCriterion: (id, data) =>
      apiRequest(`/v1/evaluations/criteria/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteCriterion: (id) =>
      apiRequest(`/v1/evaluations/criteria/${id}/`, { method: "DELETE" }),

    getEvaluations: () => apiRequest("/v1/evaluations/evaluations/"),
    getEvaluation: (id) => apiRequest(`/v1/evaluations/evaluations/${id}/`),
    createEvaluation: (data) =>
      apiRequest("/v1/evaluations/evaluations/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateEvaluation: (id, data) =>
      apiRequest(`/v1/evaluations/evaluations/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    patchEvaluation: (id, data) =>
      apiRequest(`/v1/evaluations/evaluations/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteEvaluation: (id) =>
      apiRequest(`/v1/evaluations/evaluations/${id}/`, { method: "DELETE" }),

    getScores: () => apiRequest("/v1/evaluations/scores/"),
    getScore: (id) => apiRequest(`/v1/evaluations/scores/${id}/`),
    createScore: (data) =>
      apiRequest("/v1/evaluations/scores/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateScore: (id, data) =>
      apiRequest(`/v1/evaluations/scores/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    patchScore: (id, data) =>
      apiRequest(`/v1/evaluations/scores/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteScore: (id) =>
      apiRequest(`/v1/evaluations/scores/${id}/`, { method: "DELETE" }),
  },

  registry: {
    getStudents: () => apiRequest("/v1/registry/students/"),
    getStudent: (id) => apiRequest(`/v1/registry/students/${id}/`),
    createStudent: (data) =>
      apiRequest("/v1/registry/students/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateStudent: (id, data) =>
      apiRequest(`/v1/registry/students/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    patchStudent: (id, data) =>
      apiRequest(`/v1/registry/students/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteStudent: (id) =>
      apiRequest(`/v1/registry/students/${id}/`, { method: "DELETE" }),

    importStudents: (data) =>
      apiRequest("/v1/registry/import-students/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    exportStudents: () => apiRequest("/v1/registry/export-students/"),
  },
};
