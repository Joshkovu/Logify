import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";

const validateSupervisorSignup = (formData) => {
  const errors = {};
  const trimmedFullName = formData.fullName.trim();
  const nameParts = trimmedFullName.split(/\s+/).filter(Boolean);

  if (!trimmedFullName) {
    errors.fullName = "Full name is required.";
  } else if (nameParts.length < 2) {
    errors.fullName = "Enter both first and last name.";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!formData.role) {
    errors.role = "Select supervisor type.";
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
  const { supervisorSignUp } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <GuestOnlyRoute>
      <AuthLayout
        title="Supervisor Signup"
        subtitle="Select Academic or Workplace Supervisor. New supervisor accounts are marked pending approval."
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
              Supervisor Type
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="">Select role</option>
              <option value="academic_supervisor">Academic Supervisor</option>
              <option value="workplace_supervisor">Workplace Supervisor</option>
            </select>
            {fieldErrors.role && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.role}</p>
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-maroonCustom px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit For Approval"}
          </button>

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
