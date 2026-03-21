import PropTypes from "prop-types";

const parameters = [
  {
    title: "Pending Reviews",
    value: 2,
    description: "Awaiting your review",
    color: "black",
  },
  {
    title: "This Week",
    value: "5",
    description: "Logs reviewed",
    color: "green",
  },
  {
    title: "Average Review Time",
    value: "1.2",
    description: "Days per log",
    color: "blue",
  },
];
const Card = ({ title, value, description, color }) => {
  return (
    <div className=" p-4 bg-white rounded-lg border border-stone-300 col-span-4  hover:shadow-lg transition-shadow duration-300 shadow">
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

const LogAnalytics = () => {
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
export default LogAnalytics;
