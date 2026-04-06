import { useEffect } from "react";
import PropTypes from "prop-types";
const CreateWeeklyLog = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed flex inset-0 items-center justify-center z-100 bg-black/50 bg-op px-4 w-full h-full"
      onClick={onClose}
    >
      <div
        className="dark:text-white dark:bg-slate-900 text-sm text-gray-600 relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-semibold dark:text-white text-black text-lg">
          Create Weekly Log
        </p>
        <p className="mb-4">
          Submit your weekly activities, learnings, and challenges
        </p>
        <p className="dark:text-white text-black font-semibold">Week Number</p>
        <p>Week 9 (Feb 24 - Mar 2, 2026)</p>
        <section className="mt-4">
          <p className="dark:text-white text-black font-semibold">
            Activities & Tasks Completed
          </p>
          <textarea
            className="w-full border border-gray-200 rounded-lg h-15 p-1.5"
            placeholder="Describe the activities and tasks you completed this week..."
          ></textarea>
        </section>
        <section className="mt-4">
          <p className="dark:text-white text-black font-semibold">
            Key Learnings
          </p>
          <textarea
            className="w-full border border-gray-200 rounded-lg h-15 p-1.5"
            placeholder="What did you learn this week?..."
          ></textarea>
        </section>
        <section className="mt-4">
          <p className="dark:text-white text-black font-semibold">
            Challenges & Solutions
          </p>
          <textarea
            className="w-full border border-gray-200 rounded-lg h-15 p-1.5"
            placeholder="Describe any challenges you faced and how you addressed them..."
          ></textarea>
        </section>
        <section className="mt-4 w-full flex gap-2 justify-end">
          <button
            className="dark:text-white dark:hover:bg-slate-700 text-black text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200 rounded-md p-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-maroonCustom text-white text-sm font-semibold hover:bg-red-800 transition-colors rounded-md p-2"
            onClick={onClose}
          >
            Submit Log
          </button>
        </section>
      </div>
    </div>
  );
};
CreateWeeklyLog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateWeeklyLog;
