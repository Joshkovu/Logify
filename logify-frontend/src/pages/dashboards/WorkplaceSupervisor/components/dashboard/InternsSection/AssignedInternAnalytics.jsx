import PropTypes from "prop-types";

const parameters = [
  {
    title: "Assigned Interns",
    value: 3,
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
const Card = ({ title, value, description, color }) => {
  return (
    <div className=" p-4 bg-white rounded-lg border border-stone-300 col-span-4 hover:-translate-y-1 hover:shadow-lg transition-shadow duration-300">
      <div className="flex mb-2 items-start justify-between flex-col">
        <div>
          <h3 className="font-medium text-sm text-gray-500">{title}</h3>
        </div>
        <div
          className={`w-full flex justify-between mt-20 text-4xl font-bold ${color == "blue" ? "text-blue-500" : ""}
          ${color == "green" ? "text-emerald-600" : ""}
          `}
        >
          {value}
        </div>
        <div className="font-medium text-sm text-gray-500 mt-1.5">
          {description}
        </div>
      </div>
    </div>
  );
};

const AssignedInternAnalytics = () => {
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
