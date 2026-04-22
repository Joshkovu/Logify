import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "../../../../components/ui/ThemeToggle";
import MetricCard from "../../../../components/ui/MetricCard";
import { TrendingUp, FileDown, Upload, X } from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  formatDateRange,
  getPlacementProgress,
  getUserDisplayName,
  loadAcademicSupervisorData,
} from "../utils/academicSupervisorData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const Reports = () => {
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [snapshot, setSnapshot] = useState({
    placements: [],
    evaluations: [],
    results: [],
    usersById: {},
    organizationsById: {},
    resultByPlacementId: {},
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await loadAcademicSupervisorData();
        setSnapshot({
          placements: data.placements,
          evaluations: data.evaluations,
          results: data.results,
          usersById: data.usersById,
          organizationsById: data.organizationsById,
          resultByPlacementId: data.resultByPlacementId,
        });
      } catch (loadError) {
        setError(loadError.message || "Unable to load report analytics.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const {
    placements,
    evaluations,
    results,
    usersById,
    organizationsById,
    resultByPlacementId,
  } = snapshot;

  const reportRows = useMemo(
    () =>
      placements.map((placement) => {
        const student = usersById[placement.intern];
        const organization = organizationsById[placement.organization];
        const result = resultByPlacementId[placement.id];
        const evaluation = evaluations.find(
          (item) => item.placement === placement.id,
        );
        const { weekLabel } = getPlacementProgress(placement);

        return {
          id: placement.id,
          name: getUserDisplayName(student, "Intern"),
          organization: organization?.name || "Unknown organization",
          progress:
            placement.status === "submitted" ? "Not Started" : weekLabel,
          status:
            placement.status === "active" || placement.status === "completed"
              ? "Active"
              : placement.status === "submitted"
                ? "Pending"
                : placement.status === "approved"
                  ? "Approved"
                  : placement.status.charAt(0).toUpperCase() +
                    placement.status.slice(1),
          score: Math.round(
            result?.final_score || evaluation?.total_score || 0,
          ),
          dateRange: formatDateRange(placement.start_date, placement.end_date),
        };
      }),
    [
      evaluations,
      organizationsById,
      placements,
      resultByPlacementId,
      usersById,
    ],
  );

  const totalInterns = reportRows.length;
  const scoredRows = reportRows.filter((student) => student.score > 0);
  const averageScore =
    scoredRows.length === 0
      ? 0
      : Math.round(
          scoredRows.reduce((total, student) => total + student.score, 0) /
            scoredRows.length,
        );
  const completionRate =
    placements.length === 0
      ? 0
      : Math.round(
          (placements.filter((placement) => placement.status === "completed")
            .length /
            placements.length) *
            100,
        );
  const activePlacements = placements.filter((placement) =>
    ["approved", "active", "completed"].includes(placement.status),
  ).length;

  const stats = [
    {
      title: "Total Interns",
      value: isLoading ? "..." : String(totalInterns),
      iconType: "interns",
    },
    {
      title: "Average Score",
      value: isLoading ? "..." : `${averageScore}%`,
      iconType: "reviews",
    },
    {
      title: "Completion Rate",
      value: isLoading ? "..." : `${completionRate}%`,
      iconType: "evaluations",
    },
    {
      title: "Active Placements",
      value: isLoading ? "..." : String(activePlacements),
      iconType: "placements",
    },
  ];

  const activeCount = reportRows.filter(
    (student) => student.status === "Active",
  ).length;
  const pendingCount = reportRows.filter(
    (student) => student.status === "Pending",
  ).length;

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setSubmitted(false);
    setError("");
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    setSubmitted(false);
  };

  const handleSubmitFiles = async () => {
    if (files.length === 0) {
      setError("Please upload at least one file before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      setSubmitted(true);
      setError(
        "Files were prepared locally, but the backend does not currently expose a supervisor report upload endpoint.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        generated_at: new Date().toISOString(),
        summary: {
          total_interns: totalInterns,
          average_score: averageScore,
          completion_rate: completionRate,
          active_placements: activePlacements,
          results_count: results.length,
        },
        students: reportRows,
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "academic-supervisor-report.json";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Failed to export report.");
    } finally {
      setLoading(false);
    }
  };

  const performanceChartData = {
    labels: reportRows.map((student) => student.name),
    datasets: [
      {
        label: "Score",
        data: reportRows.map((student) => student.score),
        backgroundColor: [
          "#7A1C1C",
          "#8B2323",
          "#9C2A2A",
          "#D6D3D1",
          "#E7E5E4",
          "#B45309",
          "#166534",
        ],
        borderRadius: 10,
        barThickness: 36,
      },
    ],
  };

  const performanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f1f1f",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6B7280",
          font: { size: 11, weight: "600" },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: "#6B7280",
          stepSize: 20,
          callback: (value) => `${value}%`,
          font: { size: 11, weight: "600" },
        },
        grid: {
          color: "rgba(0,0,0,0.06)",
          drawBorder: false,
        },
      },
    },
  };

  const statusChartData = {
    labels: ["Active", "Pending"],
    datasets: [
      {
        data: [activeCount, pendingCount],
        backgroundColor: ["#7A1C1C", "#D4AF37"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#6B7280",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
            weight: "700",
          },
        },
      },
      tooltip: {
        backgroundColor: "#1f1f1f",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
      <div className="mb-5 -mx-4 flex items-center justify-between border-b border-border px-4 pb-1.5 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 xl:-mx-12 xl:px-12">
        <h1 className="text-sm font-bold uppercase tracking-[0.18em] text-black/70 dark:text-slate-300 sm:text-base">
          LOGIFY ACADEMIC SUPERVISOR
        </h1>

        <ThemeToggle />
      </div>

      <header className="mb-8 flex flex-col items-start justify-between gap-6 sm:mb-10 lg:mb-12 md:flex-row md:items-center">
        <div>
          <h1 className="mb-3 text-3xl font-black tracking-tighter text-maroon-dark dark:text-white sm:text-4xl lg:text-5xl">
            Reports & <span className="text-gold">Analytics</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary/80 dark:text-slate-300 sm:text-base lg:text-lg">
            Gain deep insights into intern performance, placement trends, and
            academic milestones.
          </p>
          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </p>
          )}
        </div>

        <button
          onClick={() => setShowExportPanel(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-4 py-2 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon active:scale-[0.98] dark:text-slate-300 md:w-auto"
        >
          <FileDown size={18} />
          Export Semester Report
        </button>
      </header>

      {showExportPanel && (
        <section className="mb-8 rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:scale-[1.005] sm:p-6 lg:mb-12 lg:p-8 xl:p-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
                Upload Files and Export Report
              </h2>
              <p className="mt-1 text-sm text-text-secondary dark:text-slate-300">
                Upload the required files, submit them, then export the semester
                report.
              </p>
            </div>

            <button
              onClick={() => setShowExportPanel(false)}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-border dark:border-slate-700 px-4 py-2 text-sm font-bold text-maroon-dark transition-colors hover:bg-background dark:text-slate-300 dark:hover:bg-slate-800/50"
            >
              <X size={16} />
              Close
            </button>
          </div>

          <div className="rounded-2xl border border-dashed border-border dark:border-slate-700/60 bg-background dark:bg-slate-800/50 p-4 sm:p-6">
            <label className="mb-3 flex items-center gap-2 text-sm font-bold text-maroon-dark dark:text-white">
              <Upload size={18} />
              Upload files
            </label>

            <input
              type="file"
              multiple
              onChange={handleFilesChange}
              className="block w-full rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-3 text-sm text-text-secondary dark:text-slate-200 file:mr-4 file:rounded-md file:border-0 file:bg-[#7A1C1C] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#6B1818]"
            />

            {files.length > 0 && (
              <div className="mt-4 rounded-2xl border border-border/30 bg-white dark:border-slate-700/30 dark:bg-slate-900 p-4">
                <p className="mb-3 text-sm font-bold text-maroon-dark dark:text-white">
                  Selected files
                </p>

                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex flex-col gap-3 rounded-xl border border-border/30 dark:border-slate-700/30 bg-background dark:bg-slate-800/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-maroon-dark dark:text-slate-100">
                          {file.name}
                        </p>
                        <p className="text-xs text-text-secondary dark:text-slate-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="self-start rounded-lg border border-border dark:border-slate-700 px-3 py-1 text-xs font-bold text-maroon-dark transition-colors hover:bg-background dark:text-slate-300 dark:hover:bg-slate-800 sm:self-auto"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {submitted && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                Files prepared successfully. You can now export the semester
                report.
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleSubmitFiles}
                disabled={loading}
                className="w-full rounded-lg border border-emerald-700 bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? "Processing..." : "Submit Files"}
              </button>

              <button
                onClick={handleExportReport}
                disabled={loading}
                className="w-full rounded-lg border border-gold/10 bg-gold/5 px-4 py-3 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-300 sm:w-auto"
              >
                {loading ? "Processing..." : "Export Report"}
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 xl:gap-8">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            iconType={stat.iconType}
          />
        ))}
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 lg:mb-12 lg:grid-cols-3 lg:gap-8">
        <div className="rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:scale-[1.005] sm:p-6 lg:col-span-2 lg:p-8 xl:p-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gold/10 p-2 text-gold dark:text-slate-300">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
              Performance Overview
            </h2>
          </div>

          <div className="h-64 rounded-2xl border border-border/30 dark:border-slate-700/30 bg-background dark:bg-slate-800/50 p-4">
            <Bar
              data={performanceChartData}
              options={performanceChartOptions}
            />
          </div>
        </div>

        <div className="rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:scale-[1.005] sm:p-6 lg:p-8 xl:p-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gold/10 p-2 text-gold dark:text-slate-300">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
              Status Distribution
            </h2>
          </div>

          <div className="h-64 rounded-2xl border border-border/30 dark:border-slate-700/30 bg-background dark:bg-slate-800/50 p-4">
            <Doughnut data={statusChartData} options={statusChartOptions} />
          </div>
        </div>
      </section>

      <section className="rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:scale-[1.005] sm:p-6 lg:p-8 xl:p-10">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
              Detailed Performance Breakdown
            </h2>
            <p className="mt-1 text-sm text-text-secondary/80 dark:text-slate-300">
              Full list of supervised interns and their current academic
              standing
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border/50 dark:border-slate-700">
          <table className="min-w-[720px] w-full text-left">
            <thead>
              <tr className="border-b border-border/50 bg-background/70 dark:border-slate-700 dark:bg-slate-800/70">
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-8 sm:py-5">
                  Student
                </th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-8 sm:py-5">
                  Organization
                </th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-8 sm:py-5">
                  Progress
                </th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-8 sm:py-5">
                  Score
                </th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-8 sm:py-5">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/30 dark:divide-slate-700">
              {reportRows.map((student) => (
                <tr
                  key={student.id}
                  className="group transition-colors hover:bg-background/40 dark:hover:bg-slate-800/60"
                >
                  <td className="px-4 py-5 sm:px-8 sm:py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-maroonCustom/10 text-sm font-bold text-maroonCustom dark:text-slate-300">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-maroon-dark dark:text-white">
                        {student.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-5 text-sm text-text-secondary dark:text-slate-300 sm:px-8 sm:py-6">
                    {student.organization}
                  </td>

                  <td className="px-4 py-5 text-sm font-bold tracking-tight text-gold dark:text-slate-300 sm:px-8 sm:py-6">
                    {student.progress}
                  </td>

                  <td className="px-4 py-5 sm:px-8 sm:py-6">
                    <span
                      className={`text-sm font-black ${
                        student.score >= 90
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-maroon-dark dark:text-white"
                      }`}
                    >
                      {student.score > 0 ? `${student.score}%` : "-"}
                    </span>
                  </td>

                  <td className="px-4 py-5 sm:px-8 sm:py-6">
                    <span
                      className={`rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                        student.status === "Active"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300 dark:group-hover:bg-emerald-950/50"
                          : "border-gold/10 bg-gold/5 text-gold group-hover:bg-gold/10 dark:border-yellow-900 dark:bg-yellow-950/20 dark:text-yellow-300 dark:group-hover:bg-yellow-950/40"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}

              {!isLoading && reportRows.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-8 text-center text-sm text-muted-foreground"
                  >
                    No supervised intern analytics are available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Reports;
