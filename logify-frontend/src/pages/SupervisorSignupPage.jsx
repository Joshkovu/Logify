import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { api } from "../config/api.js";
import { AuthContext } from "../contexts/AuthContext";
import AuthActionButton from "../components/ui/AuthActionButton";
import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";

const validateSupervisorSignup = (formData) => {
  const errors = {};
  const trimmedFullName = formData.fullName.trim();
  const nameParts = trimmedFullName.split(/\s+/).filter(Boolean);
  const isAcademic = formData.role === "academic_supervisor";
  const isWorkplace = formData.role === "workplace_supervisor";

  if (!isAcademic && !isWorkplace) {
    errors.role = "Invalid supervisor role selected.";
  }

  if (!trimmedFullName) {
    errors.fullName = "Full name is required.";
  } else if (nameParts.length < 2) {
    errors.fullName = "Enter both first and last name.";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  }

  if (isAcademic && !formData.institution) {
    errors.institution = "Institution is required.";
  }

  if (!formData.college) {
    errors.college = isAcademic
      ? "College is required."
      : "College of student is required.";
  }

  if (isAcademic && !formData.department) {
    errors.department = "Department is required.";
  }

  if (isWorkplace && !formData.organization) {
    errors.organization = "Organization is required.";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

const SupervisorSignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { supervisorSignUp } = useContext(AuthContext);

  const queryParams = new URLSearchParams(location.search);
  const roleFromQuery = queryParams.get("role");
  const initialRole =
    roleFromQuery === "academic_supervisor" ||
    roleFromQuery === "workplace_supervisor"
      ? roleFromQuery
      : "academic_supervisor";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: initialRole,
    institution: "",
    college: "",
    department: "",
    organization: "",
    password: "",
    confirmPassword: "",
  });

  const isAcademic = formData.role === "academic_supervisor";

  const [institutions, setInstitutions] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(true);
  const [isLoadingColleges, setIsLoadingColleges] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const data = await api.academics.getInstitutions();
        setInstitutions(Array.isArray(data) ? data : []);
      } catch {
        setInstitutions([]);
        setError("Unable to load institutions right now.");
      } finally {
        setIsLoadingInstitutions(false);
      }
    };

    fetchInstitutions();
  }, []);

  useEffect(() => {
    if (formData.role === "academic_supervisor" && formData.institution) {
      const fetchColleges = async () => {
        setIsLoadingColleges(true);
        try {
          const data = await api.academics.getInstitutionColleges(
            formData.institution,
          );
          setColleges(Array.isArray(data) ? data : []);
          setFormData((prev) => ({ ...prev, college: "", department: "" }));
        } catch {
          setColleges([]);
        } finally {
          setIsLoadingColleges(false);
        }
      };
      fetchColleges();
    } else if (formData.role === "workplace_supervisor") {
      const fetchColleges = async () => {
        setIsLoadingColleges(true);
        try {
          const data = await api.academics.getColleges();
          setColleges(Array.isArray(data) ? data : []);
          setFormData((prev) => ({ ...prev, college: "" }));
        } catch {
          setColleges([]);
        } finally {
          setIsLoadingColleges(false);
        }
      };
      fetchColleges();
    } else {
      setColleges([]);
      setDepartments([]);
    }
  }, [formData.institution, formData.role]);

  useEffect(() => {
    if (formData.role === "academic_supervisor" && formData.college) {
      const fetchDepartments = async () => {
        setIsLoadingDepartments(true);
        try {
          const data = await api.academics.getCollegeDepartments(
            formData.college,
          );
          setDepartments(Array.isArray(data) ? data : []);
          setFormData((prev) => ({ ...prev, department: "" }));
        } catch {
          setDepartments([]);
        } finally {
          setIsLoadingDepartments(false);
        }
      };
      fetchDepartments();
    } else {
      setDepartments([]);
    }
  }, [formData.college, formData.role]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const errors = validateSupervisorSignup(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await supervisorSignUp(formData);
      navigate("/login", {
        replace: true,
        state: {
          signupSuccess:
            "Signup submitted. Your supervisor account is pending Internship Admin approval.",
        },
      });
    } catch (signupError) {
      setError(signupError.message || "Unable to create supervisor account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleLabel =
    formData.role === "academic_supervisor"
      ? "Academic Supervisor"
      : "Workplace Supervisor";

  return (
    <GuestOnlyRoute>
      <AuthLayout
        title={`${roleLabel} Signup`}
        subtitle="New supervisor accounts are marked pending approval by the Internship Admin."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              placeholder="Your full name"
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              placeholder="name@company.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              {isAcademic ? "Institution" : "Student College"}
            </label>
            {isAcademic ? (
              <select
                name="institution"
                value={formData.institution}
                onChange={onChange}
                disabled={isLoadingInstitutions || isSubmitting}
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="">
                  {isLoadingInstitutions ? "Loading..." : "Select institution"}
                </option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            ) : (
              <select
                name="college"
                value={formData.college}
                onChange={onChange}
                disabled={isLoadingColleges || isSubmitting}
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="">
                  {isLoadingColleges
                    ? "Loading..."
                    : "Select college of student"}
                </option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.name}
                  </option>
                ))}
              </select>
            )}
            {fieldErrors.institution && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.institution}
              </p>
            )}
            {fieldErrors.college && !isAcademic && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.college}</p>
            )}
          </div>

          {isAcademic && (
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
                College
              </label>
              <select
                name="college"
                value={formData.college}
                onChange={onChange}
                disabled={
                  !formData.institution || isLoadingColleges || isSubmitting
                }
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="">
                  {!formData.institution
                    ? "Select institution first"
                    : isLoadingColleges
                      ? "Loading..."
                      : "Select college"}
                </option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.name}
                  </option>
                ))}
              </select>
              {fieldErrors.college && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.college}
                </p>
              )}
            </div>
          )}

          {isAcademic && (
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={onChange}
                disabled={
                  !formData.college || isLoadingDepartments || isSubmitting
                }
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="">
                  {!formData.college
                    ? "Select college first"
                    : isLoadingDepartments
                      ? "Loading..."
                      : "Select department"}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {fieldErrors.department && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.department}
                </p>
              )}
            </div>
          )}

          {!isAcademic && (
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
                Organization
              </label>
              <input
                name="organization"
                type="text"
                value={formData.organization}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
                placeholder="Enter your organization name"
              />
              {fieldErrors.organization && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.organization}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              placeholder="At least 8 characters"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              placeholder="Re-enter password"
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          {fieldErrors.role && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
              {fieldErrors.role}
            </div>
          )}

          <AuthActionButton
            isLoading={isSubmitting}
            idleLabel="Submit For Approval"
            loadingLabel="Submitting..."
            loadingSteps={[
              "Checking your supervisor details.",
              "Preparing your approval request for the internship admin.",
              "Saving your signup and routing it for review.",
            ]}
          />

          <p className="text-center text-sm text-text-secondary dark:text-slate-300">
            Need admin path?{" "}
            <Link
              to="/signup/admin"
              className="font-bold text-maroonCustom hover:text-gold"
            >
              Internship Admin signup
            </Link>
          </p>
        </form>
      </AuthLayout>
    </GuestOnlyRoute>
  );
};

export default SupervisorSignupPage;
