const badgeColors = {
  draft: "bg-badge-draft text-text-secondary",
  submitted: "bg-badge-submitted text-white",
  approved: "bg-badge-approved text-white",
  rejected: "bg-badge-rejected text-white",
  pending: "bg-badge-pending text-text-primary",
};

import PropTypes from "prop-types";

const StatusBadge = ({ status }) => {
  const colorClass =
    badgeColors[typeof status === "string" ? status.toLowerCase() : "draft"] ||
    "bg-badge-draft text-text-secondary";
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full font-semibold text-xs tracking-wide ${colorClass} border border-border shadow-sm`}
      aria-label={status}
    >
      {typeof status === "string"
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "Draft"}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
