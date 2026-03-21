import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 md:px-10">
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
            Auth Home
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <section className="rounded-3xl border border-border bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-10">
            <h1 className="text-4xl font-black tracking-tight text-maroon-dark dark:text-gold sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary dark:text-slate-300 sm:text-lg">
              {subtitle}
            </p>
            <div className="mt-8">{children}</div>
          </section>

          <aside className="rounded-3xl border border-gold/30 bg-gradient-to-br from-[#6f1d2a] to-[#2f0f2a] p-8 text-slate-100 shadow-xl sm:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-gold/80">
              Secure Entry Experience
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight">
              Built For Structured Internship Governance
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-200/90">
              This flow separates new and returning users, keeps role boundaries explicit,
              and prevents accidental access paths before approval.
            </p>
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 text-xs leading-relaxed text-slate-200">
              {footer ||
                "Use a demo login from authStore seed users while backend integration is pending."}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.string,
};

AuthLayout.defaultProps = {
  footer: null,
};

export default AuthLayout;
