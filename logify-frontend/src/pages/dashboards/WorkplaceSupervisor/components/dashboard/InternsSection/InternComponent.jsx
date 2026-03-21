import PropTypes from "prop-types";

const InternComponent = ({ url, names, course, institution, week }) => {
  return (
    <div className="w-full p-4 border bg-white border-stone-300 items-center rounded-lg flex mt-3 flex-row hover:shadow-lg transition-shadow duration-300  justify-between shadow">
      <div className=" flex ">
        <img
          src={url}
          alt="avatar"
          className="size-20 rounded-full shrink-0 bg-maroonCustom shadow"
        />
        <div className="mx-3 mt-3">
          <h1 className="font-bold ">{names}</h1>
          <h2 className="text-sm text-gray-500">{course}</h2>
          <h3 className="text-sm text-gray-500">{institution}</h3>
        </div>
      </div>
      <div className=" flex flex-col items-end">
        <p className="text-sm text-gray-500">Week {week}/12</p>
        <div className="h-2 w-24 rounded-full bg-red-50 ">
          <div
            className={`h-full bg-maroonCustom rounded-l-full `}
            style={{ width: `${(week / 12) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

InternComponent.propTypes = {
  url: PropTypes.string.isRequired,
  names: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  institution: PropTypes.string.isRequired,
  week: PropTypes.number.isRequired,
};

export default InternComponent;
