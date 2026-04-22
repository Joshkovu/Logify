import { useEffect, useMemo, useState } from "react";

import {
  formatDate,
  loadWorkplaceSupervisorData,
} from "../utils/workplaceSupervisorData";

const AssignedInterns = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
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
        setPlacements(snapshot.placements);
        setWeeklyLogs(snapshot.weeklyLogs);
        setUsersById(snapshot.usersById);
        setOrganizationsById(snapshot.organizationsById);
      } catch (loadError) {
        setError(loadError.message || "Unable to load assigned interns.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const internRows = useMemo(
    () =>
      placements.map((placement) => {
        const intern = usersById[placement.intern];
        const organization = organizationsById[placement.organization];
        const internLogs = weeklyLogs.filter(
          (log) => log.placement === placement.id,
        );
        const approvedLogs = internLogs.filter(
          (log) => log.status === "approved",
        ).length;
        const lastWeek =
          internLogs.length === 0
            ? 0
            : Math.max(
                ...internLogs.map((log) => Number(log.week_number) || 0),
              );

        return {
          placementId: placement.id,
          fullName: intern
            ? `${intern.first_name} ${intern.last_name}`
            : "Unknown Intern",
          email: intern?.email || "N/A",
          phone: intern?.phone || "N/A",
          organization: organization?.name || "N/A",
          internshipTitle: placement.internship_title,
          status: placement.status,
          weekNumber: lastWeek,
          approvedLogs,
          startDate: placement.start_date,
          endDate: placement.end_date,
        };
      }),
    [placements, usersById, organizationsById, weeklyLogs],
  );

  const completionRate =
    internRows.length === 0
      ? 0
      : Math.round(
          (internRows.filter((row) => row.status === "completed").length /
            internRows.length) *
            100,
        );

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#FCFBF8] p-8 transition-all dark:bg-slate-950 lg:p-12">
      <h1 className="text-3xl font-bold">Assigned Interns</h1>
      <h2 className="mt-1 text-lg font-light text-gray-600 dark:text-slate-400">
        Manage and monitor your assigned interns.
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
          <p className="mt-2 text-3xl font-bold">{internRows.length}</p>
        </div>
        <div className="rounded-lg border border-stone-300 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Average Progress
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {internRows.length === 0
              ? "0%"
              : `${Math.round(
                  internRows.reduce((sum, row) => sum + row.weekNumber, 0) /
                    internRows.length,
                )}%`}
          </p>
        </div>
        <div className="rounded-lg border border-stone-300 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Completion Rate
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {completionRate}%
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-stone-300 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-800/50">
        {isLoading && (
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Loading assigned interns...
          </p>
        )}

        {!isLoading && internRows.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-slate-400">
            No placements are currently assigned to your account.
          </p>
        )}

        <div className="space-y-4">
          {internRows.map((row) => (
            <article
              key={row.placementId}
              className="rounded-lg border border-stone-200 p-5 dark:border-slate-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold">{row.fullName}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {row.internshipTitle} at {row.organization}
                  </p>
                </div>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase dark:bg-slate-700">
                  {row.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
                <p>
                  <span className="font-semibold">Email:</span> {row.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {row.phone}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span>{" "}
                  {formatDate(row.startDate)} - {formatDate(row.endDate)}
                </p>
                <p>
                  <span className="font-semibold">Approved Logs:</span>{" "}
                  {row.approvedLogs}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AssignedInterns;
