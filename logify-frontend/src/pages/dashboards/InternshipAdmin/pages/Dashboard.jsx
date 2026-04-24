import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Clock } from "lucide-react";
import MetricCard from "../../../../components/ui/MetricCard";
import { api } from "../../../../config/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const normalizeCollection = (payload, key) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const scoreBuckets = [
  { label: "0-49", min: 0, max: 49.99 },
  { label: "50-59", min: 50, max: 59.99 },
  { label: "60-69", min: 60, max: 69.99 },
  { label: "70-79", min: 70, max: 79.99 },
  { label: "80-89", min: 80, max: 89.99 },
  { label: "90-100", min: 90, max: 100 },
];

const formatStatus = (status = "") =>
  status
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const toRelativeTime = (value) => {
  if (!value) return "Just now";

  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return "Just now";

  const diffMs = Date.now() - target.getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60)
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [results, setResults] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      const [
        studentsResult,
        placementsResult,
        resultsResult,
        evaluationsResult,
      ] = await Promise.allSettled([
        api.registry.getStudents(),
        api.placements.getPlacements(),
        api.evaluations.getResults(),
        api.evaluations.getEvaluations(),
      ]);

      if (!isMounted) return;

      setStudents(
        studentsResult.status === "fulfilled"
          ? normalizeCollection(studentsResult.value, "students")
          : [],
      );
      setPlacements(
        placementsResult.status === "fulfilled"
          ? normalizeCollection(placementsResult.value, "placements")
          : [],
      );
      setResults(
        resultsResult.status === "fulfilled"
          ? normalizeCollection(resultsResult.value, "results")
          : [],
      );
      setEvaluations(
        evaluationsResult.status === "fulfilled"
          ? normalizeCollection(evaluationsResult.value, "evaluations")
          : [],
      );

      if (
        [
          studentsResult,
          placementsResult,
          resultsResult,
          evaluationsResult,
        ].every((result) => result.status === "rejected")
      ) {
        setError("Unable to load dashboard analytics right now.");
      }

      setLoading(false);
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const activePlacements = placements.filter(
    (placement) => String(placement.status).toLowerCase() === "active",
  ).length;

  const pendingReviews = evaluations.filter((evaluation) =>
    ["submitted", "draft"].includes(String(evaluation.status).toLowerCase()),
  ).length;

  const completedEvaluations = results.length;

  const metrics = [
    { title: "Total Interns", value: students.length, iconType: "interns" },
    {
      title: "Active Placements",
      value: activePlacements,
      iconType: "placements",
    },
    { title: "Pending Reviews", value: pendingReviews, iconType: "reviews" },
    {
      title: "Completed Evaluations",
      value: completedEvaluations,
      iconType: "evaluations",
    },
  ];

  const scoreDistribution = scoreBuckets.map(
    (bucket) =>
      results.filter((result) => {
        const score = Number(result.final_score || result.total_score || 0);
        return score >= bucket.min && score <= bucket.max;
      }).length,
  );

  const placementTrend = monthLabels.map(
    (_, monthIndex) =>
      placements.filter((placement) => {
        const sourceDate =
          placement.created_at ||
          placement.submitted_at ||
          placement.approved_at;
        if (!sourceDate) return false;
        const date = new Date(sourceDate);
        return !Number.isNaN(date.getTime()) && date.getMonth() === monthIndex;
      }).length,
  );

  const activity = [
    ...students.map((student) => ({
      id: `student-${student.id}`,
      title: "Student registration processed",
      description: `Student ID #${student.student_number || student.id} was added to the registry.`,
      timestamp: student.created_at,
    })),
    ...placements.map((placement) => ({
      id: `placement-${placement.id}`,
      title: `Placement ${formatStatus(placement.status) || "updated"}`,
      description: `${placement.internship_title || "Internship placement"} is currently ${formatStatus(placement.status) || "in progress"}.`,
      timestamp:
        placement.updated_at || placement.approved_at || placement.created_at,
    })),
    ...results.map((result) => ({
      id: `result-${result.id}`,
      title: "Evaluation result computed",
      description: `A final score of ${Number(result.final_score || result.total_score || 0).toFixed(1)}% was recorded.`,
      timestamp: result.computed_at || result.created_at,
    })),
  ]
    .filter((item) => item.timestamp)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
      <header className="mb-8 sm:mb-10 lg:mb-12">
        <div className="flex items-center gap-3 mb-2"></div>
        <h1 className="mb-3 text-3xl font-black tracking-tighter text-maroon-dark dark:text-white sm:text-4xl lg:text-5xl">
          Internship Admin <span className="text-gold">Dashboard</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary/80 dark:text-slate-300 sm:text-base lg:text-lg">
          Monitor and manage your internship programs with comprehensive data
          and real-time tracking.
        </p>
        {error ? (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        ) : null}
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 xl:gap-8">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={loading ? "..." : metric.value}
            iconType={metric.iconType}
          />
        ))}
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:scale-102 sm:p-6 lg:p-8 xl:p-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
                Score Distribution
              </h2>
              <p className="mt-1 text-sm text-text-secondary dark:text-slate-300 sm:text-base">
                Final evaluation scores breakdown for current batch
              </p>
            </div>
            <div className="w-fit rounded-full bg-gold/10 px-3 py-1 dark:text-slate-300 text-xs font-bold uppercase tracking-[0.2em] text-gold sm:text-sm">
              Live
            </div>
          </div>
          <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-border dark:border-slate-700/60 bg-gray-50/50 dark:bg-slate-800/50 p-2 sm:h-64">
            <Bar
              data={{
                labels: scoreBuckets.map((bucket) => bucket.label),
                datasets: [
                  {
                    label: "Students",
                    data: scoreDistribution,
                    backgroundColor: "#800000",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
        <div className="rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:scale-102 sm:p-6 lg:p-8 xl:p-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-slate-300 sm:text-2xl">
                Placement Trends
              </h2>
              <p className="mt-1 text-sm text-text-secondary dark:text-slate-300 sm:text-base">
                Monthly growth in internship applications
              </p>
            </div>
            <div className="w-fit rounded-full bg-maroon/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-maroon dark:text-slate-300 sm:text-sm">
              Monthly
            </div>
          </div>
          <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-border dark:border-slate-700/60 bg-gray-50/50 dark:bg-slate-800/50 p-2 sm:h-64">
            <Line
              data={{
                labels: monthLabels,
                datasets: [
                  {
                    label: "Placements",
                    data: placementTrend,
                    borderColor: "#FFD700",
                    backgroundColor: "rgba(255,215,0,0.1)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="w-full rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-transform hover:scale-101 sm:p-6 lg:p-8 xl:p-10">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-slate-300 sm:text-2xl">
              Recent System Activity
            </h2>
            <button
              onClick={() => toast.info("Activity log history coming soon!")}
              className="w-full rounded-lg border border-gold/10 bg-gold/5 px-4 py-2 text-xs font-bold text-gold transition-colors hover:text-maroon dark:text-slate-300 sm:w-auto"
            >
              View All logs
            </button>
          </div>

          <div className="space-y-4">
            {activity.length > 0 ? (
              activity.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-start gap-3 rounded-2xl border border-border dark:border-slate-700/30 bg-background dark:bg-slate-800/50 p-4 transition-colors hover:bg-background dark:hover:bg-slate-800 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center dark:text-slate-300 justify-center rounded-xl bg-gold/10 text-gold">
                    <Clock size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-maroon-dark dark:text-slate-300 sm:text-base">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-text-secondary dark:text-slate-300">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wide text-text-secondary/50 dark:text-slate-400 sm:text-sm">
                    {toRelativeTime(item.timestamp)}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-border dark:border-slate-700/30 bg-background dark:bg-slate-800/50 p-6 text-sm text-text-secondary dark:text-slate-300">
                {loading
                  ? "Loading recent activity..."
                  : "No recent activity found."}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
