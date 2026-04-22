import { Eye, Mail, Phone } from "lucide-react";
import PropTypes from "prop-types";

const Intern_details = ({
  image,
  name,
  course,
  institution,
  start_date,
  performance,
  week,
  email,
  contact,
  logs,
}) => {
  return (
    <div className=" mt-3 p-6 border border-stone-300 col-span-12 rounded-lg bg-white dark:bg-slate-800/50 dark:border-slate-700/50">
      <div className=" w-full flex justify-between items-center">
        <div className=" flex ">
          <img
            src={image}
            alt="avatar"
            className="size-18 rounded-full shrink-0 bg-maroonCustom shadow"
          />
          <div className="mx-3 mt-3">
            <h1 className="font-bold text-xl">{name}</h1>
            <h2 className="text-lg text-gray-500 dark:text-slate-400">
              {course} Intern
            </h2>
          </div>
        </div>
        <button className="flex p-1.5 border border-stone-200 rounded-lg">
          <Eye className="size-5" />
          <p className="ml-1 text-sm font-bold text-gray-700 dark:text-slate-300">
            View Details
          </p>
        </button>
      </div>
      <div className="grid grid-cols-12 mt-6">
        <div className="flex col-span-12 justify-evenly items-start">
          <div className=" w-full">
            <h1 className="text-sm font-medium text-gray-500 dark:text-slate-400">
              University
            </h1>
            <h2 className="font-bold ">{institution}</h2>
          </div>
          <div className=" w-full">
            <h1 className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Start Date
            </h1>
            <h2 className="font-bold ">{start_date}</h2>
          </div>
          <div className=" w-full">
            <h1 className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Performance
            </h1>
            <h2 className="font-bold text-emerald-500">{performance}</h2>
          </div>
        </div>
        <div className="flex col-span-12 justify-evenly items-start mt-6">
          <div className="flex w-full items-center">
            <Mail className="size-4 text-gray-500 dark:text-slate-400" />
            <p className="text-gray-500 text-sm font-medium ml-1.5 dark:text-slate-400">
              {email}
            </p>
          </div>
          <div className="flex w-full items-center">
            <Phone className="size-4 text-gray-500 dark:text-slate-400" />
            <p className="text-gray-500 text-sm font-medium ml-1.5 dark:text-slate-400">
              {contact}
            </p>
          </div>
        </div>
        <div className="flex col-span-12 justify-between mt-6 ">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Internship Progress
          </p>
          <p className="text-sm text-gray-700 font-medium dark:text-slate-300">
            Week {week} of 12
          </p>
        </div>
        <div className="col-span-12 my-3 h-2 bg-red-50 w-full rounded-full">
          <div
            className={`h-full bg-maroonCustom rounded-l-full `}
            style={{ width: `${(week / 12) * 100}%` }}
          ></div>
        </div>
        <div className="flex col-span-12 justify-between ">
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {logs} logs approved
          </p>
          <p className="text-xs text-gray-700 font-medium dark:text-slate-300">
            {12 - week} weeks remaining
          </p>
        </div>
      </div>
    </div>
  );
};

Intern_details.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  institution: PropTypes.string.isRequired,
  start_date: PropTypes.string.isRequired,
  performance: PropTypes.string.isRequired,
  week: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  contact: PropTypes.string.isRequired,
  logs: PropTypes.number.isRequired,
};

export default Intern_details;
