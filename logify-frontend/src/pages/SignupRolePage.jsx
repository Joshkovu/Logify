import { Link } from "react-router-dom";
import { Building2, ShieldCheck, GraduationCap } from "lucide-react";

import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";

const SignupRolePage = () => {
  return (
    <GuestOnlyRoute>
      <AuthLayout
        title="Sign Up"
        subtitle="Select your account type first. Role choice controls your onboarding path and access permissions."
        footer="Each role has different access levels and responsibilities within the internship management system."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/signup/student"
            className="rounded-2xl border border-border bg-[#fffdf9] p-6 transition-all hover:bg-emerald-50 hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 hover:dark:bg-emerald-950/20"
          >
            <div className="inline-flex rounded-xl bg-emerald-600 p-3 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-maroon-dark dark:text-gold">
              Student
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-slate-300">
              Register as an internship student to track placements, submit logs, and receive evaluations.
            </p>
          </Link>

          <Link
            to="/signup/admin"
            className="rounded-2xl border border-border bg-[#fffdf9] p-6 transition-all hover:bg-blue-50 hover:border-blue-200 dark:border-slate-700 dark:bg-slate-800 hover:dark:bg-blue-950/20"
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
            to="/signup/supervisor"
            className="rounded-2xl border border-border bg-[#fffdf9] p-6 transition-all hover:bg-amber-50 hover:border-amber-200 dark:border-slate-700 dark:bg-slate-800 hover:dark:bg-amber-950/20"
          >
            <div className="inline-flex rounded-xl bg-maroonCustom p-3 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-maroon-dark dark:text-gold">
              Supervisor
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-slate-300">
              Choose Academic Supervisor or Workplace Supervisor, then submit for approval.
            </p>
          </Link>
        </div>
      </AuthLayout>
    </GuestOnlyRoute>
  );
};

export default SignupRolePage;
