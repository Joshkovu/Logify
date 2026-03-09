import { Users, Clock4, TrendingUp } from "lucide-react";
import PropTypes from "prop-types";


const parameters = [
  {
    title: "Assigned Interns",
    value: 3,
    icon: <Users />,
    description: "Currently supervising",
    color: "black",
  },
  {
    title: "Pending Reviews",
    value: 12,
    icon: <Clock4 />,
    description: "Logs pending review",
    color: "amber",
  },
  {
    title: "Approved rate",
    value: 85,
    icon: <TrendingUp />,
    description: "Of reviewd logs",
    color: "green",
  },
];
const Card = ({ title, value, icon, description, color }) => {
  return (
    <div className=" p-4 rounded-lg border border-stone-300 col-span-4 hover:-translate-y-1 hover:shadow-lg transition-shadow duration-300">
      <div className="flex mb-2 items-start justify-between flex-col">
        <div>
          <h3 className="font-medium text-sm text-gray-500">{title}</h3>
        </div>
        <div
          className={`w-full flex justify-between mt-20 text-2xl font-bold ${color == "amber" ? "text-amber-500" : ""}
          ${color == "green" ? "text-green-500" : ""}
          `}
        >
          {value}
          {icon}
        </div>
        <div className="font-medium text-sm text-gray-500 mt-1.5">
          {description}
        </div>
      </div>
    </div>
  );
};

const InternAnalytics = () => {
  const paraItems = parameters.map((parameter) => (
    <Card
      key={parameter.title}
      title={parameter.title}
      value={parameter.value}
      icon={parameter.icon}
      description={parameter.description}
      color={parameter.color}
    />
  ));

  return <>{paraItems}</>;
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.element.isRequired,
  description: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};  
export default InternAnalytics;



