import { useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const stats = [
  {
    title: "Total Interns",
    value: "15",
    iconType: "interns",
  },
  {
    title: "Average Score",
    value: "86.6%",
    iconType: "reviews",
  },
  {
    title: "Completion Rate",
    value: "95%",
    iconType: "evaluations",
  },
  {
    title: "Active Placements",
    value: "5",
    iconType: "placements",
  },
];

const students = [
  {
    name: "Sarah Johnson",
    organization: "TechCorp Solutions",
    progress: "Week 8/12",
    status: "Active",
    score: 85,
  },
  {
    name: "Robert Kim",
    organization: "DataTech Analytics",
    progress: "Week 10/12",
    status: "Active",
    score: 88,
  },
  {
    name: "Lisa Wang",
    organization: "CloudNet Systems",
    progress: "Week 6/12",
    status: "Active",
    score: 92,
  },
  {
    name: "David Chen",
    organization: "FinTech Corp",
    progress: "Not Started",
    status: "Pending",
    score: 0,
  },
  {
    name: "Maria Garcia",
    organization: "InnovateTech",
    progress: "Not Started",
    status: "Pending",
    score: 0,
  },
];

const Reports = () => {
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeCount = students.filter(
    (student) => student.status === "Active",
  ).length;
  const pendingCount = students.filter(
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
      // Replace this with your real API/file upload call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSubmitted(true);
    } catch {
      setError("Failed to submit files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    if (!submitted) {
      setError("Please submit uploaded files before exporting the report.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Replace this with your real export API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const blob = new Blob(["Semester Report Export"], {
        type: "text/plain;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "semester-report.txt";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Failed to export report.");
    } finally {
      setLoading(false);
    }
  };

  const performanceChartData = {
    labels: students.map((student) => student.name),
    datasets: [
      {
        label: "Score",
        data: students.map((student) => student.score),
        backgroundColor: [
          "#7A1C1C",
          "#8B2323",
          "#9C2A2A",
          "#D6D3D1",
          "#E7E5E4",
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
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
            weight: "600",
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: "#6B7280",
          stepSize: 20,
          callback: function (value) {
            return `${value}%`;
          },
          font: {
            size: 11,
            weight: "600",
          },
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
    <div className="min-h-screen w-full bg-[#FCFCFA] px-4 py-6 font-sans text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-12 lg:py-10">
      <header className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-12 md:flex-row md:items-center">
        <div>
          <h1 className="mb-3 text-3xl font-black tracking-tighter text-maroon-dark dark:text-white sm:text-4xl lg:text-5xl">
            Reports & <span className="text-gold">Analytics</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-text-secondary/80 dark:text-slate-300 sm:text-lg">
            Gain deep insights into intern performance, placement trends, and
            academic milestones.
          </p>
        </div>

        <button
          onClick={() => setShowExportPanel(true)}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#7A1C1C] bg-gradient-to-r from-[#7A1C1C] to-[#8B2323] px-6 py-4 font-bold text-white shadow-lg shadow-[#7A1C1C]/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:from-[#6B1818] hover:to-[#7A1C1C] md:w-auto"
        >
          <FileDown size={20} className="text-white" />
          Export Semester Report
        </button>
      </header>

      {showExportPanel && (
        <section className="mb-10 rounded-[12px] border border-border bg-[#FEFEFC] p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6 lg:mb-12 lg:p-8">
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
              className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <X size={16} />
              Close
            </button>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-[#FBFBF8] p-4 dark:border-slate-600 dark:bg-slate-800/60 sm:p-6">
            <label className="mb-3 flex items-center gap-2 text-sm font-bold text-maroon-dark dark:text-white">
              <Upload size={18} />
              Upload files
            </label>

            <input
              type="file"
              multiple
              onChange={handleFilesChange}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-[#7A1C1C] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#6B1818] dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
            />

            {files.length > 0 && (
              <div className="mt-4 rounded-xl border border-border/50 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="mb-3 text-sm font-bold text-maroon-dark dark:text-white">
                  Selected files
                </p>

                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex flex-col gap-3 rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="self-start rounded-md bg-red-50 px-3 py-1 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60 sm:self-auto"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </div>
            )}

            {submitted && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                Files submitted successfully. You can now export the semester
                report.
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleSubmitFiles}
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? "Processing..." : "Submit Files"}
              </button>

              <button
                onClick={handleExportReport}
                disabled={loading}
                className="w-full rounded-xl bg-[#7A1C1C] px-5 py-3 font-bold text-white transition hover:bg-[#6B1818] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? "Processing..." : "Export Report"}
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mb-12 lg:grid-cols-4 lg:gap-8">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            iconType={stat.iconType}
          />
        ))}
      </section>

      <section className="mb-10 grid grid-cols-1 gap-6 lg:mb-12 lg:grid-cols-3 lg:gap-8">
        <div className="rounded-[12px] border border-border bg-[#FEFEFC] p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6 lg:col-span-2 lg:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-maroonCustom/10 p-2 text-maroonCustom dark:bg-maroonCustom/20">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
              Performance Overview
            </h2>
          </div>

          <div className="h-64 rounded-3xl border border-border/50 bg-[#FBFBF8] p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <Bar
              data={performanceChartData}
              options={performanceChartOptions}
            />
          </div>
        </div>

        <div className="rounded-[12px] border border-border bg-[#FEFEFC] p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6 lg:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-gold/10 p-2 text-gold dark:bg-gold/20">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
              Status Distribution
            </h2>
          </div>

          <div className="h-64 rounded-3xl border border-border/50 bg-[#FBFBF8] p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <Doughnut data={statusChartData} options={statusChartOptions} />
          </div>
        </div>
      </section>

      <section className="rounded-[12px] border border-border bg-[#FEFEFC] p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6 lg:p-10">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
              Detailed Performance Breakdown
            </h2>
            <p className="mt-1 text-sm font-medium italic text-text-secondary opacity-60 dark:text-slate-300">
              Full list of supervised interns and their current academic
              standing
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border/50 dark:border-slate-700">
          <table className="min-w-[720px] w-full text-left">
            <thead>
              <tr className="border-b border-border/50 bg-[#FAFAF7] dark:border-slate-700 dark:bg-slate-800/70">
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60 dark:text-slate-300 sm:px-8 sm:py-5">
                  Student
                </th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60 dark:text-slate-300 sm:px-8 sm:py-5">
                  Organization
                </th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60 dark:text-slate-300 sm:px-8 sm:py-5">
                  Progress
                </th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60 dark:text-slate-300 sm:px-8 sm:py-5">
                  Score
                </th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60 dark:text-slate-300 sm:px-8 sm:py-5">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/30 dark:divide-slate-700">
              {students.map((student) => (
                <tr
                  key={student.name}
                  className="group transition-colors hover:bg-[#FBFBF8] dark:hover:bg-slate-800/60"
                >
                  <td className="px-4 py-5 sm:px-8 sm:py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-maroonCustom/5 text-sm font-bold text-maroonCustom dark:bg-maroonCustom/20">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-maroon-dark dark:text-slate-100 sm:text-md">
                        {student.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-5 text-sm font-medium text-text-secondary dark:text-slate-300 sm:px-8 sm:py-6">
                    {student.organization}
                  </td>

                  <td className="px-4 py-5 text-sm font-bold tracking-tight text-gold sm:px-8 sm:py-6">
                    {student.progress}
                  </td>

                  <td className="px-4 py-5 sm:px-8 sm:py-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-black sm:text-md ${
                          student.score >= 90
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-maroon-dark dark:text-slate-100"
                        }`}
                      >
                        {student.score > 0 ? `${student.score}%` : "—"}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-5 sm:px-8 sm:py-6">
                    <span
                      className={`rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
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
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Reports;
