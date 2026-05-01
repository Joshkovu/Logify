import ThemeToggle from "../../../../components/ui/ThemeToggle";
import MetricCard from "../../../../components/ui/MetricCard";
import { User, CheckCircle2, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  formatDate,
  formatDateRange,
  formatRelativeTime,
  getPlacementProgress,
  getPlacementStudentName,
  getUserDisplayName,
  loadAcademicSupervisorData,
} from "../utils/academicSupervisorData";

const sectionCardClassName =
  "rounded-[12px] border border-border bg-card text-card-foreground p-4 transition-all hover:scale-[1.005] sm:p-6 lg:p-8 xl:p-10";

const Dashboard = () => {
  const [isDark] = useState(
    () => localStorage.getItem("logify-theme") === "dark",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState({
    me: null,
    placements: [],
    weeklyLogs: [],
    evaluations: [],
    usersById: {},
    organizationsById: {},
    programmeById: {},
    departmentById: {},
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("logify-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("logify-theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await loadAcademicSupervisorData();
        setSnapshot({
          me: data.me,
          placements: data.placements,
          weeklyLogs: data.weeklyLogs,
          evaluations: data.evaluations,
          usersById: data.usersById,
          organizationsById: data.organizationsById,
          programmeById: data.programmeById,
          departmentById: data.departmentById,
        });
      } catch (loadError) {
        setError(loadError.message || "Unable to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const {
    me,
    placements,
    weeklyLogs,
    evaluations,
    usersById,
    organizationsById,
    programmeById,
    departmentById,
  } = snapshot;

  const pendingApprovals = useMemo(
    () => placements.filter((placement) => placement.status === "submitted"),
    [placements],
  );

  const pendingEvaluations = useMemo(
    () =>
      evaluations.filter((evaluation) =>
        ["draft", "submitted"].includes(evaluation.status),
      ),
    [evaluations],
  );

  const summaryCards = useMemo(
    () => [
      {
        title: "Interns Supervised",
        value: isLoading ? "..." : String(placements.length),
        iconType: "interns",
      },
      {
        title: "Pending Approvals",
        value: isLoading ? "..." : String(pendingApprovals.length),
        iconType: "placements",
      },
      {
        title: "Pending Evaluations",
        value: isLoading ? "..." : String(pendingEvaluations.length),
        iconType: "evaluations",
      },
    ],
    [
      isLoading,
      pendingApprovals.length,
      pendingEvaluations.length,
      placements.length,
    ],
  );

  const supervisedInterns = useMemo(
    () =>
      placements.slice(0, 5).map((placement) => {
        const { progress, weekLabel } = getPlacementProgress(placement);
        const student = usersById[placement.intern];
        const programme = programmeById[placement.programme];
        const department = programme
          ? departmentById[programme.department]
          : null;
        return {
          id: placement.id,
          name: getPlacementStudentName(placement, usersById),
          studentNumber: student?.student_number || "Unavailable",
          yearOfStudy: student?.year_of_study || "N/A",
          company:
            organizationsById[placement.organization]?.name ||
            "Unknown organization",
          course: programme?.name || "Programme unavailable",
          department: department?.name || "Department unavailable",
          role: placement.internship_title || "Internship Placement",
          companyDepartment:
            placement.department_at_company || "Department not provided",
          workMode: placement.work_mode || "N/A",
          duration: formatDateRange(placement.start_date, placement.end_date),
          progress,
          week: weekLabel,
        };
      }),
    [departmentById, organizationsById, placements, programmeById, usersById],
  );

  const approvals = useMemo(
    () =>
      pendingApprovals.map((placement) => {
        const student = usersById[placement.intern];
        const programme = programmeById[placement.programme];
        const department = programme
          ? departmentById[programme.department]
          : null;

        return {
          id: placement.id,
          student: getPlacementStudentName(placement, usersById),
          studentNumber: student?.student_number || "Unavailable",
          department: department?.name || "Department unavailable",
          org:
            organizationsById[placement.organization]?.name ||
            "Unknown organization",
          role: placement.internship_title || "Internship Placement",
          duration: formatDateRange(placement.start_date, placement.end_date),
          date: formatDate(placement.submitted_at || placement.created_at),
          status: "Pending",
        };
      }),
    [
      departmentById,
      organizationsById,
      pendingApprovals,
      programmeById,
      usersById,
    ],
  );

  const activities = useMemo(() => {
    const logActivities = weeklyLogs
      .filter((log) => ["submitted", "approved"].includes(log.status))
      .map((log) => {
        const placement = placements.find((item) => item.id === log.placement);
        return {
          id: `log-${log.id}`,
          title:
            log.status === "approved"
              ? "Weekly Log Updated"
              : "Weekly Log Submitted",
          user: placement ? getPlacementStudentName(placement, usersById) : "",
          desc: `Week ${log.week_number || "?"} progress update`,
          time: formatRelativeTime(log.submitted_at || log.updated_at),
          sortDate: log.submitted_at || log.updated_at,
          type: "evaluation",
        };
      });

    const placementActivities = placements
      .filter((placement) => placement.status === "approved")
      .map((placement) => ({
        id: `placement-${placement.id}`,
        title: "Approved Placement",
        user: getPlacementStudentName(placement, usersById),
        desc: `${
          organizationsById[placement.organization]?.name ||
          "Unknown organization"
        } - ${placement.internship_title || "Internship Placement"}`,
        time: formatRelativeTime(placement.approved_at || placement.updated_at),
        sortDate: placement.approved_at || placement.updated_at,
        type: "placement",
      }));

    const evaluationActivities = evaluations
      .filter((evaluation) => evaluation.status === "reviewed")
      .map((evaluation) => {
        const placement = placements.find(
          (item) => item.id === evaluation.placement,
        );
        return {
          id: `evaluation-${evaluation.id}`,
          title: "Completed Evaluation",
          user: placement ? getPlacementStudentName(placement, usersById) : "",
          desc: `Score: ${Math.round(evaluation.total_score || 0)}%`,
          time: formatRelativeTime(
            evaluation.updated_at || evaluation.submitted_at,
          ),
          sortDate: evaluation.updated_at || evaluation.submitted_at,
          type: "evaluation",
        };
      });

    return [...logActivities, ...placementActivities, ...evaluationActivities]
      .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))
      .slice(0, 5);
  }, [evaluations, organizationsById, placements, usersById, weeklyLogs]);

  const welcomeName = getUserDisplayName(me, "Supervisor");

  return (
    <div className="min-h-screen w-full bg-background px-4 py-6 font-sans text-foreground transition-colors duration-300 sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
      <div className="mb-5 -mx-4 flex items-center justify-between border-b border-border px-4 pb-1.5 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 xl:-mx-12 xl:px-12">
        <h1 className="text-sm font-bold uppercase tracking-[0.18em] text-black/70 dark:text-slate-300 sm:text-base">
          LOGIFY ACADEMIC SUPERVISOR
        </h1>

        <ThemeToggle />
      </div>

      <header className="mb-8 sm:mb-10 lg:mb-12">
        <h1 className="mb-3 text-3xl font-black tracking-tighter text-maroon-dark dark:text-white sm:text-4xl lg:text-5xl">
          Academic <span className="text-gold">Dashboard</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
          {isLoading
            ? "Loading your supervision overview..."
            : `Welcome back, ${welcomeName}! Monitor student progress and manage academic approvals with real-time statistics.`}
        </p>
        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        )}
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-8">
        {summaryCards.map(({ title, value, iconType }) => (
          <MetricCard
            key={title}
            title={title}
            value={value}
            iconType={iconType}
          />
        ))}
      </section>

      <section className="mb-8">
        <div className={sectionCardClassName}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
                Supervised Interns
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Students currently under your mentorship
              </p>
            </div>

            <div className="w-fit rounded-full bg-maroon/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-maroon dark:text-slate-300 sm:text-sm">
              Active
            </div>
          </div>

          <div className="space-y-4">
            {!isLoading && supervisedInterns.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No interns are currently assigned to your supervisor account.
              </p>
            )}

            {supervisedInterns.map((intern) => (
              <div
                key={intern.id}
                className="rounded-2xl border border-border bg-muted p-4 transition-all hover:scale-[1.005] sm:p-5"
              >
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroonCustom/10 font-bold text-maroonCustom dark:text-slate-300">
                      {intern.name.charAt(0)}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-maroon-dark dark:text-white sm:text-base lg:text-lg">
                        {intern.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {intern.company}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/80">
                        {intern.role}
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gold dark:text-slate-300">
                    {intern.week}
                  </span>
                </div>

                <div className="mb-2 h-3 w-full overflow-hidden rounded-full border border-border/30 bg-background">
                  <div
                    className="h-full rounded-full bg-maroonCustom transition-all duration-1000 dark:bg-gold"
                    style={{ width: `${intern.progress}%` }}
                  />
                </div>

                <div className="mb-4 text-right text-xs font-semibold text-muted-foreground">
                  {intern.progress}%
                </div>

                <div className="grid gap-3 border-t border-border/40 pt-4 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="font-bold uppercase tracking-[0.16em] text-maroon-dark/60 dark:text-slate-300">
                      Reg No.
                    </p>
                    <p className="mt-1 font-semibold">{intern.studentNumber}</p>
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-[0.16em] text-maroon-dark/60 dark:text-slate-300">
                      Department
                    </p>
                    <p className="mt-1 font-semibold">{intern.department}</p>
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-[0.16em] text-maroon-dark/60 dark:text-slate-300">
                      Internship
                    </p>
                    <p className="mt-1 font-semibold">
                      {intern.companyDepartment} &bull; {intern.workMode}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-[0.16em] text-maroon-dark/60 dark:text-slate-300">
                      Duration
                    </p>
                    <p className="mt-1 font-semibold">{intern.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className={sectionCardClassName}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
                Pending Approvals
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Review and authorize new internship site requests
              </p>
            </div>

            <div className="w-fit rounded-full bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gold dark:text-slate-300 sm:text-sm">
              Review
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-border/50 bg-muted/70">
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Student
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Department
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Organization
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Internship
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Submitted On
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Status
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/30">
                {!isLoading && approvals.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center text-sm text-muted-foreground sm:px-6"
                    >
                      No pending placement approvals right now.
                    </td>
                  </tr>
                )}

                {approvals.map((approval) => (
                  <tr
                    key={approval.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-5 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 font-bold text-gold dark:text-slate-300">
                          {approval.student.charAt(0)}
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-maroon-dark dark:text-white">
                            {approval.student}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {approval.studentNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-5 text-sm text-muted-foreground sm:px-6">
                      {approval.department}
                    </td>

                    <td className="px-4 py-5 text-sm text-muted-foreground sm:px-6">
                      {approval.org}
                    </td>

                    <td className="px-4 py-5 text-sm text-muted-foreground sm:px-6">
                      <p>{approval.role}</p>
                      <p className="mt-1 text-xs">{approval.duration}</p>
                    </td>

                    <td className="px-4 py-5 text-sm text-muted-foreground sm:px-6">
                      {approval.date}
                    </td>

                    <td className="px-4 py-5 sm:px-6">
                      <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        {approval.status}
                      </span>
                    </td>

                    <td className="px-4 py-5 sm:px-6">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-4 py-2 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon active:scale-[0.98] dark:text-slate-300"
                      >
                        Review
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={sectionCardClassName}>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
            Recent Supervision Activity
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Chronological log of your recent interactions and approvals
          </p>
        </div>

        <div className="space-y-4">
          {!isLoading && activities.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No recent supervision activity is available yet.
            </p>
          )}

          {activities.map((activity) => {
            const isEvaluation = activity.type === "evaluation";

            return (
              <div
                key={activity.id}
                className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-muted p-4 transition-colors hover:bg-background sm:flex-row sm:items-center sm:gap-5 sm:p-5"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    isEvaluation
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {isEvaluation ? (
                    <CheckCircle2 size={22} />
                  ) : (
                    <User size={22} />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-bold text-maroon-dark dark:text-slate-300 sm:text-base">
                    {activity.title} &bull;{" "}
                    <span className="font-medium text-muted-foreground">
                      {activity.user}
                    </span>
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {activity.desc}
                  </p>
                </div>

                <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground/60 sm:text-sm">
                  {activity.time}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
