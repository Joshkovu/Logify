const rawApiBaseUrl = import.meta.env.VITE_BACKEND_URL;

if (!rawApiBaseUrl) {
  throw new Error(
    "VITE_BACKEND_URL is not defined. Set it to your backend API base URL, for example https://your-host/api",
  );
}

const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

const SESSION_STORAGE_KEY = "logify-auth-session";

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
    studentRequestOTP: (data) =>
      apiRequest("/v1/auth/student/request-otp/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    studentVerifyOTP: (data) =>
      apiRequest("/v1/auth/student/verify-otp/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  accounts: {
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
    getInstitutionDepartments: (institutionId) =>
      apiRequest(`/v1/academics/institutions/${institutionId}/departments/`),

    getProgrammes: () => apiRequest("/v1/academics/programmes/"),
    getProgramme: (id) => apiRequest(`/v1/academics/programmes/${id}/`),
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

    assignAcademicSupervisor: (id, data) =>
      apiRequest(
        `/v1/placements/placements/${id}/assign-academic-supervisor/`,
        { method: "POST", body: JSON.stringify(data) },
      ),
    assignWorkplaceSupervisor: (id, data) =>
      apiRequest(
        `/v1/placements/placements/${id}/assign-workplace-supervisor/`,
        { method: "POST", body: JSON.stringify(data) },
      ),
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
    approveWeeklyLog: (id) =>
      apiRequest(`/v1/logbook/approve_weekly_log/${id}/`, { method: "POST" }),
    rejectWeeklyLog: (id) =>
      apiRequest(`/v1/logbook/reject_weekly_log/${id}/`, { method: "POST" }),
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
  },

  organizations: {
    getOrganizations: () => apiRequest("/v1/organizations/createOrganization/"),
    getOrganization: (id) =>
      apiRequest(`/v1/organizations/getOrganization/${id}/`),
    createOrganization: (data) =>
      apiRequest("/v1/organizations/createOrganization/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateOrganization: (id, data) =>
      apiRequest(`/v1/organizations/getOrganization/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    patchOrganization: (id, data) =>
      apiRequest(`/v1/organizations/getOrganization/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteOrganization: (id) =>
      apiRequest(`/v1/organizations/getOrganization/${id}/`, {
        method: "DELETE",
      }),
  },

  reports: {
    getReport: (studentId, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/v1/reports/weekly_logs_report/${studentId}/${queryString ? "?" + queryString : ""}`;
      return apiRequest(endpoint);
    },
  },

  evaluations: {
    getResults: () => apiRequest("/v1/evaluations/results/"),
    getResult: (id) => apiRequest(`/v1/evaluations/results/${id}/`),

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

    getRegistrationAttempts: () =>
      apiRequest("/v1/registry/registration-attempts/"),
    requestOTP: (data) =>
      apiRequest("/v1/registry/registration-attempts/request_otp/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    verifyOTP: (data) =>
      apiRequest("/v1/registry/registration-attempts/verify_otp/", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    importStudents: (data) =>
      apiRequest("/v1/registry/import-students/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    exportStudents: () => apiRequest("/v1/registry/export-students/"),
  },
};
