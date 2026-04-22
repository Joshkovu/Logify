import { useEffect, useMemo, useState } from "react";

import {
  formatDate,
  loadWorkplaceSupervisorData,
} from "../../utils/workplaceSupervisorData";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [usersById, setUsersById] = useState({});
  const [organizationsById, setOrganizationsById] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const snapshot = await loadWorkplaceSupervisorData();
        setMe(snapshot.me);
        setPlacements(snapshot.placements);
        setWeeklyLogs(snapshot.weeklyLogs);
        setUsersById(snapshot.usersById);
        setOrganizationsById(snapshot.organizationsById);
      } catch (loadError) {
        setError(loadError.message || "Unable to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingLogs = useMemo(
    () => weeklyLogs.filter((log) => log.status === "submitted"),
    [weeklyLogs],
  );

  const reviewedLogs = useMemo(
    () =>
      weeklyLogs.filter((log) =>
        ["approved", "rejected", "changes_requested"].includes(log.status),
      ),
    [weeklyLogs],
  );

  const approvedLogs = useMemo(
    () => weeklyLogs.filter((log) => log.status === "approved"),
    [weeklyLogs],
  );

  const approvalRate =
    reviewedLogs.length === 0
      ? 0
      : Math.round((approvedLogs.length / reviewedLogs.length) * 100);

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#FCFBF8] p-8 transition-all dark:bg-slate-950 lg:p-12">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <h2 className="mt-1 text-lg font-light text-gray-600 dark:text-slate-400">
        {isLoading
          ? "Loading your supervision overview..."
          : `Welcome back, ${me?.first_name || "Supervisor"}.`}
      </h2>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-stone-300 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Assigned Interns
          </p>
          <p className="mt-2 text-3xl font-bold">{placements.length}</p>
        </div>
        <div className="rounded-lg border border-stone-300 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Pending Reviews
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {pendingLogs.length}
          </p>
        </div>
        <div className="rounded-lg border border-stone-300 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Approval Rate
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {approvalRate}%
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-stone-300 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-800/50">
        <h3 className="text-xl font-bold">Assigned Interns</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Current placements linked to your workplace supervisor account.
        </p>
        <div className="mt-4 space-y-3">
          {!isLoading && placements.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              No interns are currently assigned to you.
            </p>
          )}
          {placements.slice(0, 5).map((placement) => {
            const intern = usersById[placement.intern];
            const organization = organizationsById[placement.organization];
            return (
              <div
                key={placement.id}
                className="rounded-lg border border-stone-200 p-4 dark:border-slate-700"
              >
                <p className="font-semibold">
                  {intern
                    ? `${intern.first_name} ${intern.last_name}`
                    : "Intern"}
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {placement.internship_title} at{" "}
                  {organization?.name || "Unknown organization"}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">
                  {formatDate(placement.start_date)} -{" "}
                  {formatDate(placement.end_date)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-stone-300 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-800/50">
        <h3 className="text-xl font-bold">Pending Log Reviews</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Most recent weekly logs waiting for your action.
        </p>
        <div className="mt-4 space-y-3">
          {!isLoading && pendingLogs.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              No submitted logs are waiting for review.
            </p>
          )}
          {pendingLogs.slice(0, 5).map((log) => {
            const placement = placements.find(
              (item) => item.id === log.placement,
            );
            const intern = placement ? usersById[placement.intern] : null;
            return (
              <div
                key={log.id}
                className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20"
              >
                <p className="font-semibold">
                  {intern
                    ? `${intern.first_name} ${intern.last_name}`
                    : "Intern"}{" "}
                  - Week {log.week_number}
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Submitted {formatDate(log.submitted_at || log.updated_at)}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
