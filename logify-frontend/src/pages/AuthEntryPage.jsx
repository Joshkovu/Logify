import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";

const AuthEntryPage = () => {
  return (
    <GuestOnlyRoute>
      <AuthLayout
        title="Authentication Entry"
        subtitle="Choose whether to log in as a returning user or start role-based signup as a new user."
        footer="New users should complete role-specific signup. Returning users should log in with their existing webmail and password."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/login"
            className="group rounded-2xl border border-border bg-[#fffdf9] p-6 transition-colors hover:bg-gold/10 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="inline-flex rounded-xl bg-maroonCustom p-3 text-white">
              <LogIn className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-maroon-dark dark:text-gold">
              Login
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-slate-300">
              Returning user access with role-aware routing after successful authentication.
            </p>
          </Link>

          <Link
            to="/signup"
            className="group rounded-2xl border border-border bg-[#fffdf9] p-6 transition-colors hover:bg-gold/10 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="inline-flex rounded-xl bg-maroonCustom p-3 text-white">
              <UserPlus className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-maroon-dark dark:text-gold">
              Sign Up
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-slate-300">
              New user onboarding with strict role selection for Supervisor or Internship Admin.
            </p>
          </Link>
        </div>
      </AuthLayout>
    </GuestOnlyRoute>
  );
};

export default AuthEntryPage;
