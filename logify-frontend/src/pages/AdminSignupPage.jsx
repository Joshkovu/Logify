import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../config/api.js";
import { AuthContext } from "../contexts/AuthContext";
import AuthActionButton from "../components/ui/AuthActionButton";
import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";

const validateAdminSignup = (formData) => {
  const errors = {};
  const trimmedFullName = formData.fullName.trim();
  const nameParts = trimmedFullName.split(/\s+/).filter(Boolean);

  if (!trimmedFullName) {
    errors.fullName = "Full name is required.";
  } else if (nameParts.length < 2) {
    errors.fullName = "Enter both first and last name.";
  }

  if (!formData.email.trim()) {
    errors.email = "Institutional email is required.";
  }

  if (!formData.institution) {
    errors.institution = "Institution is required.";
  }

  if (!formData.college) {
    errors.college = "College is required.";
  }

  if (!formData.department) {
    errors.department = "Department is required.";
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

const AdminSignupPage = () => {
  const navigate = useNavigate();
  const { adminSignUp } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    institution: "",
    college: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

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
    if (formData.institution) {
      const fetchColleges = async () => {
        setIsLoadingColleges(true);
        try {
          const data = await api.academics.getInstitutionColleges(formData.institution);
          setColleges(Array.isArray(data) ? data : []);
          setFormData((prev) => ({ ...prev, college: "", department: "" }));
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
  }, [formData.institution]);

  useEffect(() => {
    if (formData.college) {
      const fetchDepartments = async () => {
        setIsLoadingDepartments(true);
        try {
          const data = await api.academics.getCollegeDepartments(formData.college);
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
  }, [formData.college]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const errors = validateAdminSignup(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        college_id: Number(formData.department),
      };
      await adminSignUp(payload);
      navigate("/login", {
        replace: true,
        state: {
          signupSuccess: "Admin account created. Please log in.",
        },
      });
    } catch (signupError) {
      setError(signupError.message || "Unable to create admin account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GuestOnlyRoute>
      <AuthLayout
        title="Internship Admin Signup"
        subtitle="Create an internship administrator account for institution-level platform management."
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
              Institutional Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              placeholder="name@institution.ac.ug"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Institution
            </label>
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
            {fieldErrors.institution && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.institution}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              College
            </label>
            <select
              name="college"
              value={formData.college}
              onChange={onChange}
              disabled={!formData.institution || isLoadingColleges || isSubmitting}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="">
                {!formData.institution ? "Select institution first" : isLoadingColleges ? "Loading..." : "Select college"}
              </option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
            {fieldErrors.college && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.college}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={onChange}
              disabled={!formData.college || isLoadingDepartments || isSubmitting}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="">
                {!formData.college ? "Select college first" : isLoadingDepartments ? "Loading..." : "Select department"}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {fieldErrors.department && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.department}</p>
            )}
          </div>

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

          <AuthActionButton
            isLoading={isSubmitting}
            idleLabel="Create Admin Account"
            loadingLabel="Creating Account..."
            loadingSteps={[
              "Validating your information.",
              "Setting up your administrator access.",
              "Finalizing your login-ready workspace.",
            ]}
          />

          <p className="text-center text-sm text-text-secondary dark:text-slate-300">
            Looking for Supervisor signup?{" "}
            <Link
              to="/signup"
              className="font-bold text-maroonCustom hover:text-gold"
            >
              Switch role
            </Link>
          </p>
        </form>
      </AuthLayout>
    </GuestOnlyRoute>
  );
};

export default AdminSignupPage;
