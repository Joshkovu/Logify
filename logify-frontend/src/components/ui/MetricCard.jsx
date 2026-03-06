import { Users, Briefcase, Clock, CheckCircle2 } from "lucide-react";
import PropTypes from "prop-types";

const icons = {
  interns: <Users className="w-8 h-8 text-gold" strokeWidth={2} />,
  placements: <Briefcase className="w-8 h-8 text-gold" strokeWidth={2} />,
  reviews: <Clock className="w-8 h-8 text-gold" strokeWidth={2} />,
  evaluations: <CheckCircle2 className="w-8 h-8 text-gold" strokeWidth={2} />,
};

const MetricCard = ({ title, value, iconType }) => (
  <div className="bg-surface shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl p-6 flex items-center gap-5 border border-border/50">
    <div className="shrink-0 p-3 bg-gold/5 rounded-xl border border-gold/10">
      {icons[iconType]}
    </div>
    <div>
      <div className="text-[11px] font-bold uppercase text-text-secondary tracking-[0.1em] mb-1 opacity-80">
        {title}
      </div>
      <div className="text-3xl font-black text-maroon-dark tracking-tight">
        {value}
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
