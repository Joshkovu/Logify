import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { LoaderCircle } from "lucide-react";

const AuthActionButton = ({
  isLoading,
  idleLabel,
  loadingLabel,
  loadingSteps,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading || loadingSteps.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % loadingSteps.length);
    }, 1400);

    return () => window.clearInterval(intervalId);
  }, [isLoading, loadingSteps]);

  const activeStep = loadingSteps[stepIndex] || loadingSteps[0] || "";

  return (
    <div className="space-y-3">
      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="group relative w-full overflow-hidden rounded-xl bg-maroonCustom px-6 py-3.5 text-sm font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-maroonCustom/20 disabled:cursor-not-allowed disabled:opacity-90"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {isLoading && (
          <span className="absolute inset-y-0 left-[-35%] w-1/3 skew-x-[-20deg] bg-white/20 animate-[pulse_1.6s_ease-in-out_infinite]" />
        )}

        <span className="relative flex items-center justify-center gap-3">
          {isLoading && <LoaderCircle className="size-4 animate-spin" />}
          <span>{isLoading ? loadingLabel : idleLabel}</span>
        </span>
      </button>

      <div
        className={`overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-r from-[#fff7df] via-white to-[#fdf0d8] px-4 text-sm text-maroon-dark transition-all duration-300 dark:border-gold/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:text-slate-200 ${
          isLoading
            ? "max-h-24 translate-y-0 py-3 opacity-100"
            : "max-h-0 -translate-y-1 py-0 opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gold/90">
              Working on it
            </p>
            <p className="mt-1 text-sm font-semibold">{activeStep}</p>
          </div>

          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-maroonCustom animate-bounce" />
            <span
              className="size-2 rounded-full bg-gold animate-bounce"
              style={{ animationDelay: "0.15s" }}
            />
            <span
              className="size-2 rounded-full bg-maroonCustom animate-bounce"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

AuthActionButton.propTypes = {
  isLoading: PropTypes.bool,
  idleLabel: PropTypes.string.isRequired,
  loadingLabel: PropTypes.string.isRequired,
  loadingSteps: PropTypes.arrayOf(PropTypes.string),
};

AuthActionButton.defaultProps = {
  isLoading: false,
  loadingSteps: [],
};

export default AuthActionButton;
