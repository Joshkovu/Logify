import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { api } from "../../../../config/api";
import {
  formatDate,
  loadWorkplaceSupervisorData,
} from "../utils/workplaceSupervisorData";

const PendingLogReview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [placements, setPlacements] = useState([]);
  const [usersById, setUsersById] = useState({});
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [selectedLogId, setSelectedLogId] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const snapshot = await loadWorkplaceSupervisorData();
      setPlacements(snapshot.placements);
      setUsersById(snapshot.usersById);
      setWeeklyLogs(snapshot.weeklyLogs);
    } catch (loadError) {
      setError(loadError.message || "Unable to load weekly logs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingLogs = useMemo(
    () =>
      weeklyLogs
        .filter((log) => log.status === "submitted")
        .sort(
          (a, b) =>
            new Date(b.submitted_at || b.updated_at).getTime() -
            new Date(a.submitted_at || a.updated_at).getTime(),
        ),
    [weeklyLogs],
  );

  useEffect(() => {
    if (pendingLogs.length > 0 && !selectedLogId) {
      setSelectedLogId(pendingLogs[0].id);
    }
    if (pendingLogs.length === 0) {
      setSelectedLogId(null);
    }
  }, [pendingLogs, selectedLogId]);

  const selectedLog =
    pendingLogs.find((log) => log.id === selectedLogId) || null;

  const selectedPlacement = selectedLog
    ? placements.find((placement) => placement.id === selectedLog.placement)
    : null;
  const selectedIntern = selectedPlacement
    ? usersById[selectedPlacement.intern]
    : null;

  const handleReview = async (action) => {
    if (!selectedLog) return;

    setIsSubmitting(true);
    setError("");
    try {
      if (action === "approve") {
        await api.logbook.approveWeeklyLog(selectedLog.id, { comment });
      } else if (action === "request_changes") {
        await api.logbook.requestChangesWeeklyLog(selectedLog.id, { comment });
      } else {
        await api.logbook.rejectWeeklyLog(selectedLog.id, { comment });
      }

      setComment("");
      await loadData();

      if (action === "approve") {
        toast.success("Weekly log approved successfully!");
      } else if (action === "request_changes") {
        toast.success("Changes requested successfully!");
      } else {
        toast.success("Weekly log rejected successfully!");
      }
    } catch (reviewError) {
      setError(reviewError.message || "Unable to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#FCFBF8] p-8 transition-all dark:bg-slate-950 lg:p-12">
      <ToastContainer position="top-right" />
      <h1 className="text-3xl font-bold">Pending Log Reviews</h1>
      <h2 className="mt-1 text-lg font-light text-gray-600 dark:text-slate-400">
        Review submitted weekly logs and provide feedback.
      </h2>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-stone-300 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Pending Reviews
          </p>
          <p className="mt-2 text-3xl font-bold">{pendingLogs.length}</p>
        </div>
        <div className="rounded-lg border border-stone-300 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Reviewed This Week
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {
              weeklyLogs.filter((log) => {
                const reviewedStatuses = [
                  "approved",
                  "rejected",
                  "changes_requested",
                ];
                if (!reviewedStatuses.includes(log.status)) return false;
                const updated = new Date(log.updated_at);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return updated >= sevenDaysAgo;
              }).length
            }
          </p>
        </div>
        <div className="rounded-lg border border-stone-300 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Average Review Time
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600">N/A</p>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <aside className="rounded-lg border border-stone-300 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-800/50 xl:col-span-4">
          <h3 className="text-lg font-semibold">Pending Logs</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Select a log to inspect and review.
          </p>

          <div className="mt-4 space-y-3">
            {isLoading && (
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Loading pending logs...
              </p>
            )}

            {!isLoading && pendingLogs.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-slate-400">
                No submitted logs currently require review.
              </p>
            )}

            {pendingLogs.map((log) => {
              const placement = placements.find(
                (item) => item.id === log.placement,
              );
              const intern = placement ? usersById[placement.intern] : null;
              const isActive = log.id === selectedLogId;

              return (
                <button
                  key={log.id}
                  type="button"
                  onClick={() => setSelectedLogId(log.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    isActive
                      ? "border-maroonCustom bg-red-50 dark:bg-slate-700"
                      : "border-stone-200 hover:shadow dark:border-slate-700"
                  }`}
                >
                  <p className="font-semibold">
                    {intern
                      ? `${intern.first_name} ${intern.last_name}`
                      : "Intern"}{" "}
                    - Week {log.week_number}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Submitted {formatDate(log.submitted_at || log.updated_at)}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="rounded-lg border border-stone-300 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-800/50 xl:col-span-8">
          {!selectedLog && (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Select a pending log to start reviewing.
            </p>
          )}

          {selectedLog && (
            <>
              <div className="border-b border-stone-200 pb-3 dark:border-slate-700">
                <h3 className="text-xl font-semibold">
                  {selectedIntern
                    ? `${selectedIntern.first_name} ${selectedIntern.last_name}`
                    : "Intern"}{" "}
                  - Week {selectedLog.week_number}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Submitted on{" "}
                  {formatDate(
                    selectedLog.submitted_at || selectedLog.updated_at,
                  )}
                </p>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-semibold">Activities</h4>
                  <p className="text-sm text-gray-700 dark:text-slate-300">
                    {selectedLog.activities}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Key Learnings</h4>
                  <p className="text-sm text-gray-700 dark:text-slate-300">
                    {selectedLog.learnings}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Challenges</h4>
                  <p className="text-sm text-gray-700 dark:text-slate-300">
                    {selectedLog.challenges}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold">
                  Review Comment
                </label>
                <textarea
                  className="h-28 w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:ring-1 focus:ring-maroonCustom dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
                  placeholder="Write your feedback for the intern..."
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleReview("approve")}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleReview("request_changes")}
                  className="rounded-md border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-60 dark:hover:bg-blue-900/20"
                >
                  Request Changes
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleReview("reject")}
                  className="rounded-md border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-900/20"
                >
                  Reject
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default PendingLogReview;
