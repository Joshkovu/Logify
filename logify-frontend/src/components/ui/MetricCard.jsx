const icons = {
  interns: (
    <svg
      className="w-8 h-8 text-gold"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  placements: (
    <svg
      className="w-8 h-8 text-gold"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  reviews: (
    <svg
      className="w-8 h-8 text-gold"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
    </svg>
  ),
  evaluations: (
    <svg
      className="w-8 h-8 text-gold"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M9 17v-2a4 4 0 0 1 4-4h4" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  ),
};

import PropTypes from "prop-types";

const MetricCard = ({ title, value, iconType }) => (
  <div className="bg-surface shadow-md rounded-xl p-6 flex items-center gap-4 border border-border min-w-50">
    <div className="shrink-0">{icons[iconType]}</div>
    <div>
      <div className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
        {title}
      </div>
      <div className="text-3xl font-extrabold text-text-primary">{value}</div>
    </div>
  </div>
);

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  iconType: PropTypes.string.isRequired,
};

export default MetricCard;
