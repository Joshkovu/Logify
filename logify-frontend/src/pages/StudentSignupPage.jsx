import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, BookOpen, Building2 } from "lucide-react";

import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";
import {
  validateCommonSignupFields,
  registerStudent,
} from "./auth/authStore";

const StudentSignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    matriculationNumber: "",
    institution: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setGlobalError("");
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate common fields
      const commonErrors = validateCommonSignupFields({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      const studentErrors = {};

      if (!formData.matriculationNumber.trim()) {
        studentErrors.matriculationNumber =
          "Matriculation/Student ID is required.";
      }

      if (!formData.institution.trim()) {
        studentErrors.institution = "Educational institution is required.";
      }

      if (!formData.department.trim()) {
        studentErrors.department = "Department is required.";
      }

      const allErrors = { ...commonErrors, ...studentErrors };

      if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);
        setIsSubmitting(false);
        return;
      }

      // Attempt registration
      const result = registerStudent({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        matriculationNumber: formData.matriculationNumber,
        institution: formData.institution,
        department: formData.department,
      });

      if (!result.ok) {
        setGlobalError(result.error || "Registration failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to login with success message
      navigate("/login", {
        state: {
          signupSuccess:
            "Account created successfully! Please log in with your credentials.",
        },
      });
    } catch (error) {
      setGlobalError(
        error.message || "An unexpected error occurred. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <GuestOnlyRoute>
      <AuthLayout
        title="Student Sign Up"
        subtitle="Create your student account to access the internship management portal and track your progress."
        footer="Already have an account? Sign in to your existing student account."
      >
        <form onSubmit={onSubmit} className="space-y-5">
          {globalError && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
              {globalError}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold"
            >
              <User className="h-4 w-4" />
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={onChange}
              placeholder="John Doe"
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800 ${
                errors.fullName ? "border-red-400" : "border-border"
              }`}
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold"
            >
              Email / Webmail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              placeholder="student@students.mak.ac.ug"
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800 ${
                errors.email ? "border-red-400" : "border-border"
              }`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Matriculation Number */}
          <div>
            <label
              htmlFor="matriculationNumber"
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold"
            >
              <BookOpen className="h-4 w-4" />
              Matriculation / Student ID
            </label>
            <input
              id="matriculationNumber"
              name="matriculationNumber"
              type="text"
              value={formData.matriculationNumber}
              onChange={onChange}
              placeholder="20/U/000000"
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800 ${
                errors.matriculationNumber ? "border-red-400" : "border-border"
              }`}
              disabled={isSubmitting}
            />
            {errors.matriculationNumber && (
              <p className="mt-1 text-xs text-red-600">
                {errors.matriculationNumber}
              </p>
            )}
          </div>

          {/* Institution */}
          <div>
            <label
              htmlFor="institution"
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold"
            >
              <Building2 className="h-4 w-4" />
              Educational Institution
            </label>
            <input
              id="institution"
              name="institution"
              type="text"
              value={formData.institution}
              onChange={onChange}
              placeholder="Makerere University"
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800 ${
                errors.institution ? "border-red-400" : "border-border"
              }`}
              disabled={isSubmitting}
            />
            {errors.institution && (
              <p className="mt-1 text-xs text-red-600">{errors.institution}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label
              htmlFor="department"
              className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold"
            >
              Department
            </label>
            <input
              id="department"
              name="department"
              type="text"
              value={formData.department}
              onChange={onChange}
              placeholder="Computer Science"
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800 ${
                errors.department ? "border-red-400" : "border-border"
              }`}
              disabled={isSubmitting}
            />
            {errors.department && (
              <p className="mt-1 text-xs text-red-600">{errors.department}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Minimum 8 characters"
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800 ${
                errors.password ? "border-red-400" : "border-border"
              }`}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={onChange}
              placeholder="Re-enter your password"
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800 ${
                errors.confirmPassword ? "border-red-400" : "border-border"
              }`}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-maroonCustom px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Account..." : "Create Student Account"}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <span className="text-sm text-text-secondary dark:text-slate-400">
              Already have a student account?{" "}
            </span>
            <Link
              to="/login"
              className="text-sm font-bold text-maroonCustom hover:text-maroon dark:text-gold dark:hover:text-gold/80"
            >
              Sign In
            </Link>
          </div>
        </form>
      </AuthLayout>
    </GuestOnlyRoute>
  );
};

export default StudentSignupPage;
