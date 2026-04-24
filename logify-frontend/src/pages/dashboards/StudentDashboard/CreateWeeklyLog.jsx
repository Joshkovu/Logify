import { useEffect, useState } from "react";
import { api } from "../../../config/api";
import PropTypes from "prop-types";
import { isNumber } from "chart.js/helpers";
const CreateWeeklyLog = ({ isOpen, onClose, weeklyLog = null, onAction }) => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    week_number: weeklyLog?.week_number ?? "",
    week_start_date: weeklyLog?.week_start_date ?? "",
    week_end_date: weeklyLog?.week_end_date ?? "",
    activities: weeklyLog?.activities ?? "",
    challenges: weeklyLog?.challenges ?? "",
    learnings: weeklyLog?.learnings ?? "",
  });

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!weeklyLog?.id) {
        setReviewData(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await api.logbook.getWeeklyLogReviews(weeklyLog.id);
        setReviewData(data.reviews[0]);
      } catch {
        setReviewData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviewData();
  }, [weeklyLog]);

  useEffect(() => {
    if (weeklyLog) {
      setFormData({
        week_number: weeklyLog.week_number ?? "",
        week_start_date: weeklyLog.week_start_date ?? "",
        week_end_date: weeklyLog.week_end_date ?? "",
        activities: weeklyLog.activities ?? "",
        challenges: weeklyLog.challenges ?? "",
        learnings: weeklyLog.learnings ?? "",
      });
    } else {
      setFormData({
        week_number: "",
        week_start_date: "",
        week_end_date: "",
        activities: "",
        challenges: "",
        learnings: "",
      });
    }
  }, [weeklyLog, isOpen]);
  const [submitAction, setSubmitAction] = useState("draft");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.week_number) {
      return setError("Week number is required");
    } else if (!isNumber(Number(formData.week_number))) {
      return setError("Week number is must be only a number");
    } else if (Number(formData.week_number) < 1) {
      return setError("Week number must not be less than 1");
    }

    if (!formData.week_start_date) {
      return setError("Week start date is required");
    } else if (formData.week_start_date > formData.week_end_date) {
      return setError("Week start date cannot be after week end date");
    }

    if (!formData.week_end_date) {
      return setError("Week end date is required");
    } else if (formData.week_end_date < formData.week_start_date) {
      return setError("Week end date cannot be before week start date");
    }

    if (!formData.activities) {
      return setError("Activies must not be empty");
    }
    if (!formData.challenges) {
      return setError("Challenges must not be empty");
    }
    if (!formData.learnings) {
      return setError("Learnings must not be empty");
    }

    const payload = {
      week_number: Number(formData.week_number),
      week_start_date: formData.week_start_date,
      week_end_date: formData.week_end_date,
      activities: formData.activities.trim(),
      challenges: formData.challenges.trim(),
      learnings: formData.learnings.trim(),
    };

    if (submitAction === "submit") {
      setIsSubmitting(true);
    } else if (submitAction === "draft") {
      setIsSaving(true);
    } else {
      setIsDeleting(true);
    }

    try {
      let result;
      if (weeklyLog) {
        result = await api.logbook.updateWeeklyLog(weeklyLog.id, payload);
      } else {
        result = await api.logbook.createWeeklyLog(payload);
      }
      if (submitAction === "submit") {
        const logId = weeklyLog?.id ?? result.weekly_log.id ?? result.id;
        await api.logbook.submitWeeklyLog(logId, result);
      } else if (submitAction === "delete") {
        const logId = weeklyLog?.id ?? result.weekly_log.id ?? result.id;
        await api.logbook.deleteWeeklyLog(logId, result);
      }
      if (submitAction === "submit") {
        onAction?.("submitted");
      } else if (submitAction === "delete") {
        onAction?.("deleted");
      } else if (weeklyLog) {
        onAction?.("edited");
      } else {
        onAction?.("created");
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      if (submitAction === "submit") {
        setIsSubmitting(false);
      } else if (submitAction === "draft") {
        setIsSaving(false);
      } else {
        setIsDeleting(false);
      }
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

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
        <p className="font-semibold dark:text-white text-black text-xl mb-4">
          {!weeklyLog
            ? "Create Weekly Log"
            : weeklyLog.status !== "draft"
              ? "Weekly Log Details"
              : "Edit Weekly Log"}
        </p>
        <form onSubmit={onSubmit}>
          <section>
            <p className="dark:text-white text-black font-semibold">
              Week Number
            </p>
            <input
              disabled={
                weeklyLog && weeklyLog?.status.toLowerCase() !== "draft"
              }
              name="week_number"
              value={formData.week_number}
              onChange={onChange}
              type="number"
              min="1"
              className="w-full border border-gray-200 rounded-lg p-1.5"
              placeholder="Week number"
            ></input>
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Week Start Date
            </p>
            <input
              disabled={
                weeklyLog && weeklyLog?.status.toLowerCase() !== "draft"
              }
              name="week_start_date"
              value={formData.week_start_date}
              onChange={onChange}
              type="date"
              className="w-full border border-gray-200 rounded-lg p-1.5"
            ></input>
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Week End Date
            </p>
            <input
              disabled={
                weeklyLog && weeklyLog?.status.toLowerCase() !== "draft"
              }
              name="week_end_date"
              value={formData.week_end_date}
              onChange={onChange}
              type="date"
              className="w-full border border-gray-200 rounded-lg p-1.5"
              placeholder="Week number"
            ></input>
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Activities & Tasks Completed
            </p>
            <textarea
              disabled={
                weeklyLog && weeklyLog?.status.toLowerCase() !== "draft"
              }
              name="activities"
              value={formData.activities}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg h-15 p-1.5"
              placeholder="Describe the activities and tasks you completed this week..."
            ></textarea>
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Challenges
            </p>
            <textarea
              disabled={
                weeklyLog && weeklyLog?.status.toLowerCase() !== "draft"
              }
              name="challenges"
              value={formData.challenges}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg h-15 p-1.5"
              placeholder="Describe any challenges you faced and how you addressed them..."
            ></textarea>
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Key Learnings
            </p>
            <textarea
              disabled={
                weeklyLog && weeklyLog?.status.toLowerCase() !== "draft"
              }
              name="learnings"
              value={formData.learnings}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg h-15 p-1.5"
              placeholder="What did you learn this week?..."
            ></textarea>
          </section>

          {error && (
            <section className="mt-4">
              <p className="text-red-600">{error}</p>
            </section>
          )}

          {isLoading ? (
            <p className="font-semibold">Loading supervisor comment...</p>
          ) : reviewData && reviewData.comment ? (
            // Case 1: Data exists
            <section className="mt-4">
              <p className="font-semibold">Supervisor Comment:</p>
              <div className="border rounded-md border-gray-200">
                <p className="px-1 py-1">{reviewData.comment}</p>
              </div>
            </section>
          ) : // Case 2: Finished loading, but no comment exists
          null}

          <section className="mt-4 w-full flex gap-2 justify-end">
            {(!weeklyLog || weeklyLog?.status.toLowerCase() === "draft") && (
              <>
                <button
                  disabled={isSubmitting || isSaving || isDeleting}
                  type="button"
                  className="dark:text-white dark:hover:bg-slate-700 text-black text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200 rounded-md p-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting || isSaving || isDeleting}
                  onClick={() => setSubmitAction("draft")}
                  type="submit"
                  className="bg-maroonCustom text-white text-sm font-semibold hover:bg-red-800 transition-colors rounded-md p-2"
                >
                  {isSaving ? "Saving..." : "Draft Log"}
                </button>
                <button
                  disabled={isSubmitting || isSaving || isDeleting}
                  onClick={() => setSubmitAction("submit")}
                  type="submit"
                  className="bg-maroonCustom text-white text-sm font-semibold hover:bg-red-800 transition-colors rounded-md p-2"
                >
                  {isSubmitting ? "Submitting..." : "Submit Log"}
                </button>
              </>
            )}
            {weeklyLog?.status.toLowerCase() === "draft" && (
              <button
                disabled={isSubmitting || isSaving || isDeleting}
                onClick={() => setSubmitAction("delete")}
                type="submit"
                className="bg-maroonCustom text-white text-sm font-semibold hover:bg-red-800 transition-colors rounded-md p-2"
              >
                {isDeleting ? "Deleting..." : "Delete Log"}
              </button>
            )}
            {weeklyLog && weeklyLog?.status.toLowerCase() !== "draft" && (
              <button
                disabled={isSubmitting || isSaving || isDeleting}
                type="button"
                className="mt-4 dark:text-white dark:hover:bg-slate-700 text-black text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200 rounded-md p-2"
                onClick={onClose}
              >
                Close
              </button>
            )}
          </section>
        </form>
      </div>
    </div>
  );
};
CreateWeeklyLog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  weeklyLog: PropTypes.object,
  onAction: PropTypes.func,
};

export default CreateWeeklyLog;
