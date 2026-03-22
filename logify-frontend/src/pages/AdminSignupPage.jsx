import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";
import { registerAdmin, validateCommonSignupFields } from "./auth/authStore";

const AdminSignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");

    const errors = validateCommonSignupFields(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const result = registerAdmin(formData);
    if (!result.ok) {
      setError(result.error || "Unable to create admin account.");
      return;
    }

    navigate("/login", {
      replace: true,
      state: { signupSuccess: "Admin account created. Please log in." },
    });
  };

  return (
    <GuestOnlyRoute>
      <AuthLayout
        title="Internship Admin Signup"
        subtitle="This signup path is controlled and available only to pre-authorized institutional emails."
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
            className="w-full rounded-xl bg-maroonCustom px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.01]"
          >
            Create Admin Account
          </button>

          <p className="text-center text-sm text-text-secondary dark:text-slate-300">
            Looking for Supervisor signup?{" "}
            <Link
              to="/signup/supervisor"
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
