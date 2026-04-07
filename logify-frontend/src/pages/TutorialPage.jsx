import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  UserRound,
  ClipboardCheck,
  Shield,
  Building2,
} from "lucide-react";

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
      <div className="relative min-h-screen overflow-hidden bg-slate-50 px-6 py-10 dark:bg-slate-950 md:px-12">
        {/* Background blobs for Glassmorphism */}
        <div className="pointer-events-none absolute -left-[10%] top-[5%] h-[500px] w-[500px] rounded-full bg-blue-400 opacity-20 mix-blend-multiply blur-[128px] dark:bg-blue-600 dark:opacity-20 dark:mix-blend-normal"></div>
        <div className="pointer-events-none absolute right-[0%] top-[-5%] h-[600px] w-[600px] rounded-full bg-purple-400 opacity-30 mix-blend-multiply blur-[128px] dark:bg-purple-900 dark:opacity-30 dark:mix-blend-normal"></div>
        <div className="pointer-events-none absolute bottom-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-rose-300 opacity-30 mix-blend-multiply blur-[128px] dark:bg-rose-900 dark:opacity-20 dark:mix-blend-normal"></div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <header className="mb-10 flex items-center justify-between">
            <Link
              to="/"
              className="text-3xl font-black tracking-tight text-maroon-dark dark:text-gold"
            >
              LOGI<span className="text-gold">FY</span>
            </Link>
            <Link
              to="/auth"
              className="rounded-lg border border-white/40 bg-white/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-maroon-dark backdrop-blur-md transition-all hover:bg-white/50 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              Skip Tutorial
            </Link>
          </header>

          <section className="rounded-3xl border border-white/50 bg-white/40 p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-xl dark:border-white/10 dark:bg-black/30 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-maroon-dark/80 dark:text-gold/80">
              Onboarding
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-maroon-dark dark:text-gold md:text-5xl">
              Welcome To Logify
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              Logify is an internship lifecycle workspace for universities and
              host organizations. It centralizes placement approvals, weekly
              tracking, evaluations, and reporting.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {roleCards.map((role) => (
                <article
                  key={role.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-6 shadow-[0_4px_16px_0_rgba(31,38,135,0.05)] backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-[0_8px_24px_0_rgba(31,38,135,0.1)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  {/* Subtle sheen reflection effect on hover */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full dark:via-white/10"></div>

                  <div className="relative z-10 flex flex-col items-start gap-4">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/50 px-4 py-2 text-xs font-black uppercase tracking-wider text-maroon-dark shadow-sm backdrop-blur-md dark:bg-white/10 dark:text-gold">
                      {role.icon}
                      {role.title}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {role.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-lg dark:border-white/10 dark:bg-white/5">
              <h2 className="text-sm font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
                How Tracking Works
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                Student submits placement and weekly logs. Supervisors review
                and request changes or approve. Academic evaluation and final
                reports close the loop.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-maroonCustom px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-maroonCustom/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-maroonCustom/40 dark:shadow-none"
              >
                Get Started
                <ArrowRight className="h-4 w-4 text-gold" />
              </button>
              {/* <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wider text-maroon-dark shadow-sm backdrop-blur-md transition-all hover:bg-white/50 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
              >
                Back To Landing
              </Link> */}
            </div>
          </section>
        </div>
      </div>
    </GuestOnlyRoute>
  );
};

export default TutorialPage;
