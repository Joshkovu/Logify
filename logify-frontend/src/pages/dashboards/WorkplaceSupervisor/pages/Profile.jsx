import { useEffect, useMemo, useState } from "react";

import {
  formatDate,
  loadWorkplaceSupervisorData,
} from "../utils/workplaceSupervisorData";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [weeklyLogs, setWeeklyLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const snapshot = await loadWorkplaceSupervisorData();
        setMe(snapshot.me);
        setPlacements(snapshot.placements);
        setWeeklyLogs(snapshot.weeklyLogs);
      } catch (loadError) {
        setError(loadError.message || "Unable to load profile details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const reviewedLogsCount = useMemo(
    () =>
      weeklyLogs.filter((log) =>
        ["approved", "rejected", "changes_requested"].includes(log.status),
      ).length,
    [weeklyLogs],
  );

  const approvedRate = useMemo(() => {
    if (reviewedLogsCount === 0) return 0;
    const approvedCount = weeklyLogs.filter(
      (log) => log.status === "approved",
    ).length;
    return Math.round((approvedCount / reviewedLogsCount) * 100);
  }, [weeklyLogs, reviewedLogsCount]);

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-6 py-8 font-sans transition-colors duration-300 dark:bg-slate-950 lg:px-10">
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-maroon-dark dark:text-white">
          Workplace Supervisor Profile
        </h1>
        <p className="mt-2 text-sm text-text-secondary dark:text-slate-300">
          Your account and supervision statistics from live API data.
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
            Assigned Interns
          </p>
          <p className="mt-2 text-3xl font-black text-maroon-dark dark:text-gold">
            {isLoading ? "..." : placements.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
            Reviewed Logs
          </p>
          <p className="mt-2 text-3xl font-black text-maroon-dark dark:text-gold">
            {isLoading ? "..." : reviewedLogsCount}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
            Approval Rate
          </p>
          <p className="mt-2 text-3xl font-black text-maroon-dark dark:text-gold">
            {isLoading ? "..." : `${approvedRate}%`}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
            Role
          </p>
          <p className="mt-2 text-3xl font-black text-maroon-dark dark:text-gold">
            {isLoading ? "..." : "Workplace Supervisor"}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-maroon dark:text-slate-200">
          Personal Information
        </h2>

        {isLoading ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
            Loading profile details...
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <p>
              <span className="font-semibold">Name:</span> {me?.first_name}{" "}
              {me?.last_name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {me?.email || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {me?.phone || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Department:</span>{" "}
              {me?.staff_profile?.department_name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Title:</span>{" "}
              {me?.staff_profile?.title || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Staff Number:</span>{" "}
              {me?.staff_profile?.staff_number || "N/A"}
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-lg border border-border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-maroon dark:text-slate-200">
          Recent Assigned Placements
        </h2>
        <p className="text-sm text-text-secondary dark:text-slate-400">
          Latest placements tied to your supervisor account.
        </p>

        <div className="mt-4 space-y-3">
          {!isLoading && placements.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              No placements have been assigned to you yet.
            </p>
          )}

          {placements.slice(0, 5).map((placement) => (
            <div
              key={placement.id}
              className="rounded-lg border border-stone-200 p-4 dark:border-slate-700"
            >
              <p className="font-semibold">{placement.internship_title}</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {formatDate(placement.start_date)} -{" "}
                {formatDate(placement.end_date)}
              </p>
              <p className="mt-1 text-xs uppercase text-gray-500 dark:text-slate-500">
                Status: {placement.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
