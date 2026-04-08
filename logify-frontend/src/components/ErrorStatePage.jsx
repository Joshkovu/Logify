/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const ErrorStatePage = ({
  code,
  title,
  description,
  imageUrl,
  imageAlt,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
  secondaryAction,
}) => {
  return (
    <div className="min-h-screen bg-[#f5f4f1] px-6 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 px-6 py-8 shadow-[0_30px_80px_rgba(59,15,22,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-maroonCustom via-gold to-maroonCustom opacity-80" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl dark:bg-gold/10" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-maroonCustom/8 blur-3xl dark:bg-maroonCustom/15" />

          <Link
            to="/"
            className="inline-flex text-3xl font-black tracking-tight text-maroon-dark transition-opacity hover:opacity-80 dark:text-gold"
          >
            LOGI<span className="text-gold">FY</span>
          </Link>

          <section className="mx-auto mt-8 flex max-w-3xl flex-col items-center text-center">
            <div className="w-full max-w-md">
              <img
                src={imageUrl}
                alt={imageAlt}
                className="mx-auto h-auto w-full max-w-[22rem] object-contain sm:max-w-sm"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-8">
              <p className="text-5xl font-black tracking-[-0.06em] text-maroon-dark dark:text-white sm:text-6xl">
                Error <span className="text-gold">{code}</span>.
              </p>
              <h1 className="mt-4 text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 sm:text-2xl">
                {title}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-text-secondary dark:text-slate-300 sm:text-base">
                {description}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={primaryTo}
                className="inline-flex min-w-40 items-center justify-center rounded-full bg-maroonCustom px-8 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(122,31,43,0.22)] transition-all hover:-translate-y-0.5 hover:bg-maroon-dark"
              >
                {primaryLabel}
              </Link>

              {secondaryAction ? (
                <button
                  type="button"
                  onClick={secondaryAction}
                  className="inline-flex min-w-40 items-center justify-center rounded-full border border-border bg-white px-8 py-3 text-sm font-bold text-maroon-dark transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:bg-gold/5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-gold/40 dark:hover:bg-slate-800"
                >
                  {secondaryLabel}
                </button>
              ) : (
                secondaryTo && (
                  <Link
                    to={secondaryTo}
                    className="inline-flex min-w-40 items-center justify-center rounded-full border border-border bg-white px-8 py-3 text-sm font-bold text-maroon-dark transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:bg-gold/5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-gold/40 dark:hover:bg-slate-800"
                  >
                    {secondaryLabel}
                  </Link>
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ErrorStatePage;
