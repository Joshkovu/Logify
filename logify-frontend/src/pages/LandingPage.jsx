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
    <div className="min-h-screen bg-[#FCFBF8] font-sans selection:bg-gold/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-black text-maroon-dark uppercase tracking-widest">
              University Internship Management
            </span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black text-maroon-dark mb-6 tracking-tighter leading-none">
            LOGI<span className="text-gold">FY.</span>
          </h1>
          <p className="text-xl text-text-secondary/80 max-w-2xl mx-auto leading-relaxed font-medium">
            A premium, end-to-end platform for streamlining internship
            documentation, tracking professional growth, and managing academic
            excellence.
          </p>
        </div>
      </section>

      {/* Dashboard Selection */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {dashboards.map((dash, i) => (
            <Link
              key={i}
              to={dash.path}
              className="group relative overflow-hidden rounded-[32px] p-10 h-[450px] flex flex-col justify-end transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-maroon-dark/20 border border-border bg-white"
            >
              {/* Card Background Decoration */}
              <div
                className={`absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 rounded-full opacity-[0.03] transition-transform duration-700 group-hover:scale-150 ${dash.color}`}
              />

              <div
                className={`mb-auto p-5 rounded-2xl inline-flex ${dash.color} ${dash.accent} shadow-xl`}
              >
                {dash.icon}
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl font-black text-maroon-dark mb-4 tracking-tight group-hover:text-maroon transition-colors">
                  {dash.title}
                </h3>
                <p className="text-text-secondary font-medium leading-relaxed mb-8 opacity-70">
                  {dash.description}
                </p>

                <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-maroon-dark group-hover:gap-5 transition-all">
                  Access Portal
                  <ArrowRight size={20} className="text-gold" />
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 rounded-[32px] transition-colors pointer-events-none" />
            </Link>
          ))}
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-border/50 text-center">
        <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.4em]">
          Designed for Academic Excellence &bull; 2026 Logify Systems
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
