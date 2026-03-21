import { Users, Briefcase, Clock, CheckCircle2 } from "lucide-react";
import PropTypes from "prop-types";

const icons = {
  interns: (
    <Users className="h-7 w-7 text-gold sm:h-8 sm:w-8" strokeWidth={1.1} />
  ),
  placements: (
    <Briefcase className="h-7 w-7 text-gold sm:h-8 sm:w-8" strokeWidth={1.1} />
  ),
  reviews: (
    <Clock className="h-7 w-7 text-gold sm:h-8 sm:w-8" strokeWidth={1.1} />
  ),
  evaluations: (
    <CheckCircle2
      className="h-7 w-7 text-gold sm:h-8 sm:w-8"
      strokeWidth={1.1}
    />
  ),
};

const MetricCard = ({ title, value, iconType }) => (
  <div className="flex cursor-pointer flex-col gap-4 rounded-[12px] border border-border bg-white p-4 transition-all duration-300 hover:scale-105 dark:border-slate-700 dark:bg-slate-900 sm:gap-5 sm:p-6">
    <div className="mb-1 text-sm font-medium tracking-[0.18em] text-text-secondary opacity-60 dark:text-slate-300 sm:text-base">
      {title
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ")}
    </div>
    <div className="flex w-full items-center justify-between gap-4">
      <div className="text-2xl font-black tracking-tight text-lime-600 dark:text-lime-400 sm:text-3xl">
        {value}
      </div>
      <div className="shrink-0 dark:text-slate-300 p-2 sm:p-3">
        {icons[iconType]}
      </div>
    </div>
  </div>
);

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  iconType: PropTypes.string.isRequired,
};

export default MetricCard;
