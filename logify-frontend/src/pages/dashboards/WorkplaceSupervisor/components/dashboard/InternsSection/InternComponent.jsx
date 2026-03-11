import PropTypes from "prop-types";

const InternComponent = ({ url, names, course, institution }) => {
  return (
    <div className="w-full p-4 border bg-white border-stone-300 items-start rounded-lg flex mt-3 flex-row hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1">
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
    </div>
  );
};

InternComponent.propTypes = {
  url: PropTypes.string.isRequired,
  names: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  institution: PropTypes.string.isRequired,
};

export default InternComponent;
