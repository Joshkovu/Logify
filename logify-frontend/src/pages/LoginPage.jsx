import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";
import { authenticate } from "./auth/authStore";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const signupSuccess = location.state?.signupSuccess || "";

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!formData.email.trim() || !formData.password) {
        setError("Email and password are required.");
        setIsSubmitting(false);
        return;
      }

      const result = authenticate(formData);
      if (!result.ok) {
        setError(result.error || "Unable to log in.");
        setIsSubmitting(false);
        return;
      }

      // Update auth context with session
      login(result.session);

      // Redirect to dashboard
      navigate(result.redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <GuestOnlyRoute>
      <AuthLayout
        title="Login"
        subtitle="Secure login for returning users. This flow is token-ready for future JWT backend integration."
        footer="Demo accounts available: student@students.mak.ac.ug, internship.admin@mak.ac.ug, academic.supervisor@mak.ac.ug."
      >
        <form onSubmit={onSubmit} className="space-y-5">
          {signupSuccess && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
              {signupSuccess}
            </div>
          )}

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
              placeholder="name@institution.ac.ug"
              disabled={isSubmitting}
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-gold disabled:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 ${
                error ? "border-red-400" : "border-border"
              }`}
            />
          </div>

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
              placeholder="Enter your password"
              disabled={isSubmitting}
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-gold disabled:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 ${
                error ? "border-red-400" : "border-border"
              }`}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-maroonCustom px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-text-secondary dark:text-slate-300">
            New to Logify?{" "}
            <Link
              to="/signup"
              className="font-bold text-maroonCustom hover:text-gold"
            >
              Sign up
            </Link>
          </p>
        </form>
      </AuthLayout>
    </GuestOnlyRoute>
  );
};

export default LoginPage;
