import { Link } from "react-router-dom";
import { Building2, ShieldCheck } from "lucide-react";

import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";

const SignupRolePage = () => {
  return (
    <GuestOnlyRoute>
      <AuthLayout
        title="Sign Up"
        subtitle="Select your account type first. Role choice controls your onboarding path and access permissions."
        footer="Student signup is intentionally excluded in this phase. Supervisor accounts enter pending approval after registration."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/signup/admin"
            className="rounded-2xl border border-border bg-[#fffdf9] p-6 transition-colors hover:bg-gold/10 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="inline-flex rounded-xl bg-maroonCustom p-3 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-maroon-dark dark:text-gold">
              Internship Admin
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-slate-300">
              Restricted registration path for institutional administrators.
            </p>
          </Link>

          <Link
            to="/signup/supervisor?role=academic_supervisor"
            className="rounded-2xl border border-border bg-[#fffdf9] p-6 transition-colors hover:bg-gold/10 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="inline-flex rounded-xl bg-maroonCustom p-3 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-maroon-dark dark:text-gold">
              Academic Supervisor
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-slate-300">
              University staff overseeing student internships from an academic
              perspective.
            </p>
          </Link>

          <Link
            to="/signup/supervisor?role=workplace_supervisor"
            className="rounded-2xl border border-border bg-[#fffdf9] p-6 transition-colors hover:bg-gold/10 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="inline-flex rounded-xl bg-maroonCustom p-3 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-maroon-dark dark:text-gold">
              Workplace Supervisor
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-slate-300">
              On-site mentors supervising student progress at their internship
              placement.
            </p>
          </Link>
        </div>
      </AuthLayout>
    </GuestOnlyRoute>
  );
};

export default SignupRolePage;
