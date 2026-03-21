import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, UserRound, ClipboardCheck, Shield, Building2 } from "lucide-react";

import GuestOnlyRoute from "./auth/GuestOnlyRoute";

const roleCards = [
  {
    title: "Student",
    desc: "Logs weekly activities, submits placement details, and tracks progress.",
    icon: <UserRound className="h-5 w-5" />,
  },
  {
    title: "Academic Supervisor",
    desc: "Approves placements and validates academic progress and evaluations.",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Workplace Supervisor",
    desc: "Reviews practical performance and weekly workplace submissions.",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "Internship Admin",
    desc: "Oversees institutional setup, role approvals, and governance.",
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
];

const TutorialPage = () => {
  const navigate = useNavigate();

  return (
    <GuestOnlyRoute>
      <div className="min-h-screen bg-[#FCFBF8] px-6 py-10 dark:bg-slate-950 md:px-12">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 flex items-center justify-between">
            <Link
              to="/"
              className="text-3xl font-black tracking-tight text-maroon-dark dark:text-gold"
            >
              LOGI<span className="text-gold">FY</span>
            </Link>
            <Link
              to="/auth"
              className="rounded-lg border border-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-maroon-dark transition-colors hover:bg-gold/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              Skip Tutorial
            </Link>
          </header>

          <section className="rounded-3xl border border-border bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gold/80">
              Onboarding
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-maroon-dark dark:text-gold md:text-5xl">
              Welcome To Logify
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-text-secondary dark:text-slate-300">
              Logify is an internship lifecycle workspace for universities and host organizations.
              It centralizes placement approvals, weekly tracking, evaluations, and reporting.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {roleCards.map((role) => (
                <article
                  key={role.title}
                  className="rounded-2xl border border-border/70 bg-[#fffdf9] p-5 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-maroon-dark dark:text-gold">
                    {role.icon}
                    {role.title}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary dark:text-slate-300">
                    {role.desc}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-gold/25 bg-gold/10 p-5">
              <h2 className="text-sm font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
                How Tracking Works
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                Student submits placement and weekly logs. Supervisors review and request changes
                or approve. Academic evaluation and final reports close the loop.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-maroonCustom px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.01]"
              >
                Get Started
                <ArrowRight className="h-4 w-4 text-gold" />
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-maroon-dark transition-colors hover:bg-gold/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                Back To Landing
              </Link>
            </div>
          </section>
        </div>
      </div>
    </GuestOnlyRoute>
  );
};

export default TutorialPage;
