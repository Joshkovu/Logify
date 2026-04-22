import PropTypes from "prop-types";
import { assignedInternsViewModel } from "../../../viewmodels/AssignedInternsViewModel";

const Card = ({ title, value, description, color }) => {

  return (
    <div className=" p-4 bg-white rounded-lg border border-stone-300 col-span-4  hover:shadow-lg transition-shadow duration-300 shadow dark:bg-slate-800/50 dark:border-slate-700/50">
      <div className="flex mb-2 items-start justify-between flex-col">
        <div>
          <h3 className="font-medium text-sm text-gray-500 dark:text-slate-400">
            {title}
          </h3>
        </div>
        <div
          className={`w-full flex justify-between mt-20 text-4xl font-bold ${color == "blue" ? "text-blue-500" : ""}
          ${color == "green" ? "text-emerald-600" : ""}
          `}
        >
          {value}
        </div>
        <div className="font-medium text-sm text-gray-500 mt-1.5 dark:text-slate-400">
          {description}
        </div>
      </div>
    </div>
  );
};

const AssignedInternAnalytics = () => {
  const { assignedInterns, loading, error } = assignedInternsViewModel();

  if (loading) {
    return <p className="text-center text-gray-500 dark:text-slate-400">Loading analytics...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to load analytics: {error.message}</p>;
  }

  const totalInterns = (assignedInterns?.totalInterns ?? 0).toString();

  const parameters = [
    {
      title: "Assigned Interns",
      value: totalInterns,
      description: "Currently assigned",
      color: "black",
    },
    {
      title: "Average Progress",
      value: "12%",
      description: "Across all interns",
      color: "blue",
    },
    {
      title: "Completion Rate",
      value: "85%",
      description: "Logs approved on time",
      color: "green",
    },
  ];
  const paraItems = parameters.map((parameter) => (
    <Card
      key={parameter.title}
      title={parameter.title}
      value={parameter.value}
      description={parameter.description}
      color={parameter.color}
    />
  ));

  return <>{paraItems}</>;
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
export default AssignedInternAnalytics;
