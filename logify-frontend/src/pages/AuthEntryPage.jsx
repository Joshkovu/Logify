import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogIn,
  UserPlus,
  UserRound,
  Building2,
  Shield,
  ClipboardCheck,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import GuestOnlyRoute from "./auth/GuestOnlyRoute";

const roles = [
  {
    id: "student",
    title: "Student",
    desc: "Logs activities & submits reports.",
    icon: UserRound,
    signupAllowed: true,
    signupMsg: "Create a new student account.",
    signupPath: "/signup/student",
  },
  {
    id: "workplace_supervisor",
    title: "Workplace Sup.",
    desc: "Reviews workplace performance.",
    icon: Building2,
    signupAllowed: true,
    signupPath: "/signup/supervisor?role=workplace_supervisor",
  },
  {
    id: "academic_supervisor",
    title: "Academic Sup.",
    desc: "Validates academics & tracking.",
    icon: Shield,
    signupAllowed: true,
    signupPath: "/signup/supervisor?role=academic_supervisor",
  },
  {
    id: "internship_admin",
    title: "Internship Admin",
    desc: "Institutional setup & governance.",
    icon: ClipboardCheck,
    signupAllowed: true,
    signupPath: "/signup/admin",
  },
];

const AuthEntryPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const activeRole = roles.find((r) => r.id === selectedRole);

  return (
    <GuestOnlyRoute>
      <div className="flex min-h-screen bg-[#FCFBF8] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#6f1d2a] via-[#4a121c] to-[#2f0f2a] p-12 text-white lg:flex xl:w-[40%]">
          <div className="pointer-events-none absolute -left-[10%] top-0 h-[400px] w-[400px] rounded-full bg-rose-500 opacity-20 blur-[120px]"></div>
          <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-gold opacity-10 blur-[130px]"></div>

          <div className="relative z-10">
            <Link
              to="/"
              className="text-4xl font-black tracking-tight text-white transition-opacity hover:opacity-80"
            >
              LOGI<span className="text-gold">FY</span>
            </Link>
          </div>

          <div className="relative z-10 mb-8 max-w-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-gold/80 hover:text-gold">
              Welcome to the Workspace
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight">
              Begin your
              <br />
              internship journey.
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-slate-300">
              A unified authentication gateway to securely connect students,
              academic staff, and verifying organizations.
            </p>

            <div className="mt-12 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-gold">
                <Shield className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium leading-relaxed text-slate-200">
                End-to-end encrypted validation across all user roles.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Role Gateway */}
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-32">
          <div className="mx-auto w-full max-w-xl">
            {/* Mobile Header (Visible only on small screens) */}
            <div className="mb-10 lg:hidden">
              <Link
                to="/"
                className="text-3xl font-black tracking-tight text-maroon-dark dark:text-gold"
              >
                LOGI<span className="text-gold">FY</span>
              </Link>
            </div>

            <div className="mb-10 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-maroon-dark dark:text-gold sm:text-4xl">
                    {selectedRole ? "Choose Action" : "Select Your Role"}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {selectedRole
                      ? `You selected ${activeRole?.title}. What would you like to do?`
                      : "Tell us who you are to receive the right access and onboarding path."}
                  </p>
                </div>
                {!selectedRole && (
                  <button
                    onClick={() => navigate(-1)}
                    className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-xs font-bold uppercase tracking-wider text-text-secondary transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                )}
              </div>

              {selectedRole && (
                <button
                  onClick={() => setSelectedRole(null)}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-xs font-bold uppercase tracking-wider text-text-secondary transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}
            </div>

            {/* View State 1: Role Selection */}
            {!selectedRole && (
              <div className="grid gap-4 sm:grid-cols-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className="group relative flex flex-col items-start rounded-3xl border border-border bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-gold/50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-maroon-dark transition-colors group-hover:bg-gold/10 group-hover:text-gold dark:bg-slate-800 dark:text-gold">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 text-lg font-black tracking-tight text-maroon-dark dark:text-slate-100 group-hover:dark:text-gold">
                        {role.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {role.desc}
                      </p>

                      <div className="absolute right-6 top-6 opacity-0 transition-opacity group-hover:opacity-100">
                        <CheckCircle2 className="h-5 w-5 text-gold" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* View State 2: Login vs Signup Action */}
            {selectedRole && activeRole && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Log In Option (Always allowed) */}
                  <button
                    onClick={() => navigate("/login")}
                    className="group flex flex-col items-start rounded-3xl border border-border bg-white p-8 text-left shadow-sm transition-all hover:border-maroonCustom hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-maroonCustom"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-maroonCustom/10 text-maroonCustom group-hover:bg-maroonCustom group-hover:text-white dark:bg-maroonCustom/20 dark:text-maroonCustom dark:group-hover:bg-maroonCustom dark:group-hover:text-white transition-colors">
                      <LogIn className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black tracking-tight text-maroon-dark dark:text-slate-100">
                      Log In
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      Access your existing {activeRole.title.toLowerCase()}{" "}
                      workspace.
                    </p>
                  </button>

                  {/* Sign Up Option (Conditional) */}
                  <button
                    onClick={() =>
                      activeRole.signupAllowed &&
                      navigate(activeRole.signupPath)
                    }
                    disabled={!activeRole.signupAllowed}
                    className={`group  flex flex-col items-start rounded-3xl border p-8 text-left dark:hover:border-maroonCustom transition-all ${
                      activeRole.signupAllowed
                        ? "border-border bg-white shadow-sm hover:border-gold hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-gold cursor-pointer"
                        : "border-slate-100 bg-slate-50 cursor-not-allowed dark:border-slate-800 dark:bg-slate-950/50 opacity-80"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                        activeRole.signupAllowed
                          ? "bg-gold/10 text-gold  group-hover:text-white dark:bg-gold/20 dark:text-gold dark:group-hover:bg-gold"
                          : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                      }`}
                    >
                      <UserPlus className="h-6 w-6" />
                    </div>
                    <h3
                      className={`mt-6 text-2xl font-black tracking-tight ${
                        activeRole.signupAllowed
                          ? "text-maroon-dark dark:text-slate-100"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      Sign Up
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-relaxed ${
                        activeRole.signupAllowed
                          ? "text-slate-500 dark:text-slate-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {activeRole.signupAllowed
                        ? `Create a new ${activeRole.title.toLowerCase()} account.`
                        : activeRole.signupMsg}
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </GuestOnlyRoute>
  );
};

export default AuthEntryPage;
