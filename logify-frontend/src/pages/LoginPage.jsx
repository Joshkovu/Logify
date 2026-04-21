import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { setAuthUser } from "../lib/auth";

const pathFromRole = (role) =>
  role === "internship_admin"
    ? "/admin"
    : role === "academic_supervisor"
    ? "/supervisor"
    : "/student";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const queryRole = searchParams.get("role");
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fallback =
    queryRole === "internship_admin"
      ? "/admin"
      : queryRole === "academic_supervisor"
      ? "/supervisor"
      : "/student";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/accounts/login/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");

      setAuthUser(data);
      navigate(
        location.state?.from?.pathname || pathFromRole(data.role) || fallback,
        { replace: true }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-10">
        <h1 className="text-3xl font-black text-maroon-dark mb-6">Welcome back</h1>
        <p className="text-sm text-text-secondary/80 mb-8">
          Enter your email and password to sign in to Logify.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <label className="block">
            <span className="text-xs font-semibold uppercase text-text-secondary/70">
              Email
            </span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@example.com"
              type="email"
              className="mt-2 w-full rounded-2xl border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
              required
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase text-text-secondary/70">
              Password
            </span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Enter your password"
              className="mt-2 w-full rounded-2xl border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-maroonCustom px-4 py-3 text-white font-semibold hover:bg-maroon-dark transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Continue to portal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
