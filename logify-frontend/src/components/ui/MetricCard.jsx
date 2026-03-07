import { Users, Briefcase, Clock, CheckCircle2 } from "lucide-react";
import PropTypes from "prop-types";

const icons = {
  interns: <Users className="w-8 h-8 text-gold" strokeWidth={1.1} />,
  placements: <Briefcase className="w-8 h-8 text-gold" strokeWidth={1.1} />,
  reviews: <Clock className="w-8 h-8 text-gold" strokeWidth={1.1} />,
  evaluations: <CheckCircle2 className="w-8 h-8 text-gold" strokeWidth={1.1} />,
};

const MetricCard = ({ title, value, iconType }) => (
  <div className="bg-white  hover:scale-105 transition-all cursor-pointer duration-300 rounded-[12px] border border-border p-6 flex  flex-col gap-5  ">
    <div className="text-[16px] font-medium text-text-secondary tracking-widest mb-1 opacity-60">
      {title
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ")}
    </div>
    <div className="flex items-center  justify-between w-full gap-4">
      <div className="text-3xl font-black text-lime-600 tracking-tight">
        {value}
      </div>
      <div className="shrink-0  p-3">{icons[iconType]}</div>
    </div>
  </div>
);

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  iconType: PropTypes.string.isRequired,
};

export default MetricCard;
