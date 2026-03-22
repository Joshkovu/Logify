import { Link } from "react-router-dom";
import { GraduationCap, ShieldCheck, UserCog, ArrowRight } from "lucide-react";

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
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/tutorial"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-maroonCustom px-8 py-4 text-lg font-black uppercase tracking-wider text-white transition-all hover:bg-maroon-dark hover:gap-5 hover:shadow-xl hover:shadow-maroon-dark/30 dark:bg-maroon dark:hover:bg-maroon-dark"
            >
              Get Started
              <ArrowRight size={24} />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-maroonCustom bg-transparent px-8 py-4 text-lg font-black uppercase tracking-wider text-maroon-dark transition-all hover:bg-maroonCustom hover:text-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-maroon-dark"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Selection */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black tracking-tight text-maroon-dark dark:text-gold md:text-4xl">
              Choose Your Portal
            </h2>
            <p className="mt-3 text-text-secondary dark:text-slate-300">
              Select your role to access the appropriate dashboard
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {dashboards.map((dash, i) => (
              <Link
                key={i}
                to={dash.path}
                className="group relative flex flex-col justify-between h-full min-h-96 overflow-hidden rounded-3xl border border-border bg-white p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-maroon-dark/15 hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-black/30"
              >
                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 h-80 w-80 -mr-40 -mt-40 rounded-full bg-gradient-to-br from-maroonCustom/5 to-gold/5 dark:from-maroonCustom/10 dark:to-gold/10" />

                {/* Icon Container */}
                <div className="relative z-10 mb-8 inline-flex items-center justify-center rounded-2xl bg-maroonCustom p-5 text-white shadow-lg shadow-maroonCustom/20 transition-transform duration-300 group-hover:scale-110">
                  {dash.icon}
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1">
                  <h3 className="mb-4 text-2xl font-black tracking-tight text-maroon-dark transition-colors duration-300 group-hover:text-maroon dark:text-gold dark:group-hover:text-gold">
                    {dash.title}
                  </h3>
                  <p className="mb-8 leading-relaxed text-text-secondary/75 dark:text-slate-300/85">
                    {dash.description}
                  </p>
                </div>

                {/* CTA Link */}
                <div className="relative z-10 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-maroon-dark transition-all duration-300 group-hover:gap-4 dark:text-slate-100">
                  <span>Access Portal</span>
                  <ArrowRight size={18} className="text-gold transition-transform duration-300 group-hover:translate-x-1" />
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent transition-colors duration-500 group-hover:border-gold/30 dark:group-hover:border-gold/40" />
              </Link>
            ))}
          </div>
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
