import PropTypes from "prop-types";
import { FileCheck } from "lucide-react";

const LogComponent = ({ url, names, week, date }) => {
  return (
    <div className="w-full p-6 border rounded-lg mt-4 border-amber-300 bg-amber-50 flex flex-row justify-between items-center">
      <div className=" flex ">
        <img
          src={url}
          alt="avatar"
          className="size-15 rounded-full shrink-0 bg-maroonCustom shadow"
        />
        <div className="mx-3 mt-3">
          <h1 className="font-bold ">
            {names}- Week {week}
          </h1>
          <h3 className="text-sm text-gray-500">Submitted on {date}</h3>
        </div>
      </div>
      <FileCheck className="text-amber-500" />
    </div>
  );
};

LogComponent.propTypes = {
  url: PropTypes.string.isRequired,
  names: PropTypes.string.isRequired,
  week: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
};

export default LogComponent;
