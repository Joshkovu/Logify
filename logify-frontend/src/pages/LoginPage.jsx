import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import Loading from "../components/ui/Loading";
import PasswordInput from "../components/ui/PasswordInput";
import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const signupSuccess = location.state?.signupSuccess || "";
  const requestedRoute = location.state?.from;
  const { login } = useContext(AuthContext);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const redirectTo = requestedRoute
        ? `${requestedRoute.pathname || ""}${requestedRoute.search || ""}${requestedRoute.hash || ""}`
        : null;
      await login(formData.email.trim(), formData.password, redirectTo);
    } catch (loginError) {
      setError(loginError.message || "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GuestOnlyRoute>
      {isSubmitting && <Loading />}
      <AuthLayout
        title="Login"
        subtitle="Secure login for returning users. You will be redirected back to your workspace after authentication."
        footer="Use the account credentials assigned to you by your institution or internship office."
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
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Enter your password"
          />

          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-maroonCustom px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.01]"
          >
            {isSubmitting ? "Logging In..." : "Login"}
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
