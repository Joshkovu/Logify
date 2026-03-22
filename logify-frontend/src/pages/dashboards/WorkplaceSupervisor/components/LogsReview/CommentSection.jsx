import { useState } from "react";
import { CircleCheck, CircleAlert } from "lucide-react";
import PropTypes from "prop-types";

const CommentSection = ({ intern_log }) => {
  const [comment, setComment] = useState("");
  return (
    <div className="mt-3 rounded-lg p-6 border col-span-4 bg-white border-stone-300 shadow-inner h-auto ">
      <h1 className="font-bold"> Review &amp; Feedback</h1>
      <h2 className="text-gray-500 font-medium">
        Provide a Comment for {intern_log.names}
      </h2>

      <div className="mt-4">
        <h1 className="font-bold mb-2">Comments</h1>
        <textarea
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-maroonCustom w-full h-32 resize-none"
          placeholder={`Write your feedback for ${intern_log.names} here...`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <button className="p-2 flex items-center gap-3 bg-green-600 rounded-md">
          <CircleCheck className="text-white " size={15} />
          <p className="text-sm font-bold text-white">Approve</p>
        </button>
        <button className="p-2 flex items-center gap-3 border border-blue-500 rounded-md">
          <CircleAlert className="text-blue-600 " size={15} />
          <p className="text-sm font-bold text-blue-500">Request Changes</p>
        </button>
        <button className="p-2 flex items-center gap-3 border border-red-600 rounded-md">
          <CircleAlert className="text-red-600 " size={15} />
          <p className="text-sm font-bold text-red-600">Reject</p>
        </button>
      </div>
    </div>
  );
};

CommentSection.propTypes = {
  intern_log: PropTypes.shape({
    names: PropTypes.string,
    week: PropTypes.number,
    date: PropTypes.string,
    log: PropTypes.shape({
      activities: PropTypes.string,
      learnings: PropTypes.string,
      challenges: PropTypes.string,
    }),
  }),
};

export default CommentSection;
