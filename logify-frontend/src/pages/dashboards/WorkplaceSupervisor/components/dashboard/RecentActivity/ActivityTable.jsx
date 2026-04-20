import PropTypes from "prop-types";

const ActivityTable = ({ title, comment, daysPast, Approved }) => {
  return (
    <tr>
      <td>
        <div className="flex flex-row items-center gap-3 my-2">
          <div
            className={`size-2 rounded-full ${Approved == true ? "bg-green-500" : "bg-blue-500"}`}
          />
          <div className="">
            <p className="font-bold text-xl">{title}</p>
            <p className="text-gray-500 text-xl font-light dark:text-slate-400">
              {comment}
            </p>
            <p className="text-sm text-gray-400 dark:text-slate-500">
              {daysPast} days ago
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
};

ActivityTable.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  daysPast: PropTypes.number.isRequired,
  Approved: PropTypes.bool.isRequired,
};

export default ActivityTable;
