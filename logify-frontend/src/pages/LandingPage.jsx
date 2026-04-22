import { Link } from "react-router-dom";
import {
  GraduationCap,
  ShieldCheck,
  UserCog,
  Building2,
  ArrowRight,
} from "lucide-react";

const LandingPage = () => {
  const dashboards = [
    {
      title: "Student Portal",
      description:
        "Submit weekly logs, view evaluations, and track your internship progress.",
      icon: <GraduationCap size={48} />,
      path: "/student",
      color: "bg-maroonCustom",
      accent: "text-white",
    },
    {
      title: "Internship Admin",
      description:
        "Manage institutions, supervisors, and student placements across the university.",
      icon: <UserCog size={48} />,
      path: "/admin",
      color: "bg-maroonCustom",
      accent: "text-white",
    },
    {
      title: "Academic Supervisor",
      description:
        "Review student logs, complete evaluations, and monitor academic performance.",
      icon: <ShieldCheck size={48} />,
      path: "/supervisor",
      color: "bg-maroonCustom",
      accent: "text-white",
    },
    {
      title: "Workplace Supervisor",
      description:
        "Review workplace logs, provide feedback, and oversee assigned interns in real time.",
      icon: <Building2 size={48} />,
      path: "/workplace-supervisor",
      color: "bg-maroonCustom",
      accent: "text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCFBF8] font-sans text-foreground transition-colors duration-300 selection:bg-gold/30 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 dark:border-gold/30 dark:bg-gold/15">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              University Internship Management
            </span>
          </div>
          <h1 className="mb-6 text-7xl font-black leading-none tracking-tighter text-maroon-dark dark:text-gold md:text-8xl">
            LOGI<span className="text-gold">FY.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-text-secondary/80 dark:text-slate-300">
            A premium, end-to-end platform for streamlining internship
            documentation, tracking professional growth, and managing academic
            excellence.
          </p>
        </div>
      </section>

      {/* Dashboard Selection */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {dashboards.map((dash, i) => (
            <Link
              key={i}
              to={dash.path}
              className="group relative flex h-[450px] flex-col justify-end overflow-hidden rounded-[32px] border border-border bg-white p-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-maroon-dark/20 dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-black/30"
            >
              {/* Card Background Decoration */}
              <div
                className={`absolute top-0 right-0 h-64 w-64 -mr-20 -mt-20 rounded-full opacity-[0.03] transition-transform duration-700 group-hover:scale-150 dark:opacity-[0.08] ${dash.color}`}
              />

              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gold/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:to-gold/10" />

              <div
                className={`mb-auto inline-flex rounded-2xl p-5 shadow-xl shadow-maroon-dark/10 transition-transform duration-300 group-hover:-translate-y-1 dark:shadow-black/20 ${dash.color} ${dash.accent}`}
              >
                {dash.icon}
              </div>

              <div className="relative z-10">
                <h3 className="mb-4 text-3xl font-black tracking-tight text-maroon-dark transition-colors group-hover:text-maroon dark:text-gold dark:group-hover:text-gold">
                  {dash.title}
                </h3>
                <p className="mb-8 font-medium leading-relaxed text-text-secondary opacity-70 dark:text-slate-300 dark:opacity-100">
                  {dash.description}
                </p>

                <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-maroon-dark transition-all group-hover:gap-5 dark:text-slate-100">
                  Access Portal
                  <ArrowRight size={20} className="text-gold" />
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-[32px] border-2 border-transparent transition-colors group-hover:border-gold/30 dark:group-hover:border-gold/40" />
            </Link>
          ))}
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="border-t border-border/50 py-12 text-center dark:border-slate-700/80">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-secondary/40 dark:text-slate-400">
          Designed for Academic Excellence &bull; 2026 Logify Systems
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
