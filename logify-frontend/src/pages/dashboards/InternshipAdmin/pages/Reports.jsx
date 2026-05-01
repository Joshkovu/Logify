import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/Button";
import StatusBadge from "../../../../components/ui/StatusBadge";
import { api } from "../../../../config/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Download } from "lucide-react";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

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

const normalizeCollection = (payload, key) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const toDisplayName = (student = {}) => {
  const fullName = [
    student.full_name,
    [student.first_name, student.last_name].filter(Boolean).join(" ").trim(),
  ].find(Boolean);

  if (fullName) return fullName;

  const emailName = student.webmail || student.email || "";
  const localPart = emailName.split("@")[0];
  if (!localPart) return "Unknown Student";

  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const toTitleCase = (value = "") =>
  value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const formatDate = (value) => {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getYearOptions = (placements = [], results = []) => {
  const years = new Set();

  placements.forEach((placement) => {
    const value =
      placement.created_at || placement.submitted_at || placement.approved_at;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) years.add(date.getFullYear());
  });

  results.forEach((result) => {
    const date = new Date(result.computed_at || result.created_at);
    if (!Number.isNaN(date.getTime())) years.add(date.getFullYear());
  });

  if (years.size === 0) years.add(new Date().getFullYear());

  return Array.from(years).sort((a, b) => b - a);
};

const formatScore = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric) || numeric <= 0) return "--";
  return `${numeric.toFixed(1)}%`;
};

const toCsvValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reportType, setReportType] = useState("summary");
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear()),
  );
  const [activeReportId, setActiveReportId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      const [
        studentsResult,
        placementsResult,
        evaluationsResult,
        resultsResult,
      ] = await Promise.allSettled([
        api.registry.getStudents(),
        api.placements.getPlacements(),
        api.evaluations.getEvaluations(),
        api.evaluations.getResults(),
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
      setEvaluations(
        evaluationsResult.status === "fulfilled"
          ? normalizeCollection(evaluationsResult.value, "evaluations")
          : [],
      );
      setResults(
        resultsResult.status === "fulfilled"
          ? normalizeCollection(resultsResult.value, "results")
          : [],
      );

      if (
        [
          studentsResult,
          placementsResult,
          evaluationsResult,
          resultsResult,
        ].every((result) => result.status === "rejected")
      ) {
        setError("Unable to load reporting analytics right now.");
      }

      setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const yearOptions = getYearOptions(placements, results);

  useEffect(() => {
    if (!yearOptions.includes(Number(selectedYear))) {
      setSelectedYear(String(yearOptions[0]));
    }
  }, [selectedYear, yearOptions]);

  const studentMap = students.reduce((acc, student) => {
    acc[String(student.id)] = student;
    return acc;
  }, {});

  const evaluationsByPlacementId = evaluations.reduce((acc, evaluation) => {
    const key = String(evaluation.placement);
    if (!acc[key]) acc[key] = [];
    acc[key].push(evaluation);
    return acc;
  }, {});

  const resultsByPlacementId = results.reduce((acc, result) => {
    acc[String(result.placement)] = result;
    return acc;
  }, {});

  const reportRows = placements
    .map((placement) => {
      const student = studentMap[String(placement.intern)] || null;
      const placementEvaluations =
        evaluationsByPlacementId[String(placement.id)] || [];
      const finalResult = resultsByPlacementId[String(placement.id)] || null;
      const latestEvaluation = [...placementEvaluations].sort(
        (a, b) =>
          new Date(
            b.submitted_at || b.updated_at || b.created_at || 0,
          ).getTime() -
          new Date(
            a.submitted_at || a.updated_at || a.created_at || 0,
          ).getTime(),
      )[0];

      return {
        id: placement.id,
        studentId: student?.id,
        studentName: toDisplayName(student || {}),
        studentNumber: student?.student_number || "--",
        studentEmail: student?.webmail || student?.email || "--",
        placementTitle: placement.internship_title || "Untitled Internship",
        placementStatus: toTitleCase(String(placement.status || "draft")),
        evaluationCount: placementEvaluations.length,
        evaluationStatus: latestEvaluation
          ? toTitleCase(String(latestEvaluation.status || "draft"))
          : "No Evaluations",
        finalScore: finalResult?.final_score || null,
        finalGrade: finalResult?.final_grade || "--",
        lastUpdated: formatDate(
          finalResult?.computed_at ||
            latestEvaluation?.submitted_at ||
            latestEvaluation?.updated_at ||
            placement.updated_at ||
            placement.created_at,
        ),
        rawPlacement: placement,
      };
    })
    .sort(
      (a, b) =>
        new Date(
          b.rawPlacement.updated_at || b.rawPlacement.created_at || 0,
        ).getTime() -
        new Date(
          a.rawPlacement.updated_at || a.rawPlacement.created_at || 0,
        ).getTime(),
    );

  const filteredRows = reportRows.filter((row) => {
    const matchesSearch = [
      row.studentName,
      row.studentNumber,
      row.studentEmail,
      row.placementTitle,
      row.placementStatus,
      row.evaluationStatus,
      row.finalGrade,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      row.placementStatus.toLowerCase() === statusFilter ||
      row.evaluationStatus.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activePlacements = reportRows.filter(
    (row) => row.placementStatus === "Active",
  ).length;
  const completedEvaluations = evaluations.filter(
    (evaluation) => String(evaluation.status).toLowerCase() === "reviewed",
  ).length;
  const pendingReviews = evaluations.filter((evaluation) =>
    ["draft", "submitted"].includes(String(evaluation.status).toLowerCase()),
  ).length;
  const averageScore = (() => {
    const scores = results
      .map((result) => Number(result.final_score || 0))
      .filter((score) => !Number.isNaN(score) && score > 0);

    if (scores.length === 0) return "0.0%";

    return `${(scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)}%`;
  })();

  const reportCards = [
    {
      title: "Internship Placements",
      value: loading ? "..." : activePlacements,
      description: "Active placements this period",
    },
    {
      title: "Evaluations Completed",
      value: loading ? "..." : completedEvaluations,
      description: "Evaluations marked as reviewed",
    },
    {
      title: "Pending Reviews",
      value: loading ? "..." : pendingReviews,
      description: "Draft or submitted evaluations",
    },
    {
      title: "Average Score",
      value: loading ? "..." : averageScore,
      description: "Across all final results",
    },
  ];

  const placementTrend = monthLabels.map(
    (_, monthIndex) =>
      placements.filter((placement) => {
        const sourceDate =
          placement.created_at ||
          placement.submitted_at ||
          placement.approved_at;
        const date = new Date(sourceDate);
        return (
          !Number.isNaN(date.getTime()) &&
          date.getFullYear() === Number(selectedYear) &&
          date.getMonth() === monthIndex
        );
      }).length,
  );

  const averageScoresTrend = monthLabels.map((_, monthIndex) => {
    const monthScores = results
      .filter((result) => {
        const date = new Date(result.computed_at || result.created_at);
        return (
          !Number.isNaN(date.getTime()) &&
          date.getFullYear() === Number(selectedYear) &&
          date.getMonth() === monthIndex
        );
      })
      .map((result) => Number(result.final_score || 0))
      .filter((score) => !Number.isNaN(score) && score > 0);

    if (monthScores.length === 0) return 0;

    return Number(
      (
        monthScores.reduce((sum, score) => sum + score, 0) / monthScores.length
      ).toFixed(1),
    );
  });

  const exportSummary = () => {
    const rows = filteredRows.map((row) =>
      [
        row.studentName,
        row.studentNumber,
        row.placementTitle,
        row.placementStatus,
        row.evaluationStatus,
        formatScore(row.finalScore),
        row.finalGrade,
        row.lastUpdated,
      ]
        .map(toCsvValue)
        .join(","),
    );

    const csv = [
      [
        "Student",
        "Student Number",
        "Placement",
        "Placement Status",
        "Evaluation Status",
        "Final Score",
        "Final Grade",
        "Last Updated",
      ]
        .map(toCsvValue)
        .join(","),
      ...rows,
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `system-reports-${selectedYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Report exported successfully");
  };

  const handleViewReport = async (row) => {
    if (!row.studentId) {
      toast.error("This placement is missing a linked student record.");
      return;
    }

    setActiveReportId(row.id);

    try {
      const report = await api.reports.getReport(row.studentId, {
        report_type: reportType,
      });

      setSelectedReport({
        row,
        data: report,
      });
    } catch (viewError) {
      toast.error(viewError.message || "Unable to load the selected report.");
    } finally {
      setActiveReportId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-maroon dark:text-slate-300 sm:text-4xl">
            System Reports
          </h1>
          <p className="text-sm text-text-secondary dark:text-slate-300 sm:text-base lg:text-lg">
            Comprehensive analytics and on-demand student report generation
          </p>
        </div>
        <Button
          type="button"
          onClick={exportSummary}
          disabled={filteredRows.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-maroonCustom px-5 py-2 font-semibold text-white shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold sm:w-auto"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {reportCards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8"
          >
            <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
              {card.title}
            </span>
            <span className="mb-2 text-3xl font-extrabold text-green-600 dark:text-emerald-400">
              {card.value}
            </span>
            <span className="text-center text-sm text-text-secondary dark:text-slate-300">
              {card.description}
            </span>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-bold text-maroon dark:text-slate-300">
            Monthly Performance Trend
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={reportType}
              onChange={(event) => setReportType(event.target.value)}
              className="rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="summary">Summary Reports</option>
              <option value="mid-term">Mid-Term Reports</option>
              <option value="final">Final Reports</option>
              <option value="evaluation">Evaluation Reports</option>
            </select>
          </div>
        </div>
        <div className="rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:scale-102 sm:p-6 lg:p-8 xl:p-10">
          <p className="mb-2 text-sm sm:text-base dark:text-slate-300">
            Placements created and average final scores by month
          </p>
          <div className="flex h-64 items-center justify-center dark:text-slate-300 sm:h-72">
            <Line
              data={{
                labels: monthLabels,
                datasets: [
                  {
                    label: "Placements",
                    data: placementTrend,
                    borderColor: "#800000",
                    backgroundColor: "rgba(128,0,0,0.1)",
                    tension: 0.35,
                  },
                  {
                    label: "Avg Score",
                    data: averageScoresTrend,
                    borderColor: "#D4A017",
                    backgroundColor: "rgba(212,160,23,0.1)",
                    tension: 0.35,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-bold text-maroon dark:text-slate-300">
            Detailed Report Table
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search reports..."
              className="rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="submitted">Submitted</option>
              <option value="reviewed">Reviewed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        <div className="rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8 lg:p-10">
          {filteredRows.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-text-secondary dark:text-slate-300">
              <span className="mb-2 text-lg font-semibold">
                {loading ? "Loading reports..." : "No reports found"}
              </span>
              <span className="text-sm">
                {loading
                  ? "Pulling placement and evaluation data."
                  : "Try adjusting your search or status filter."}
              </span>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow index={0}>
                  <TableHeaderCell>Student</TableHeaderCell>
                  <TableHeaderCell>Placement</TableHeaderCell>
                  <TableHeaderCell>Placement Status</TableHeaderCell>
                  <TableHeaderCell>Evaluation</TableHeaderCell>
                  <TableHeaderCell>Final Score</TableHeaderCell>
                  <TableHeaderCell>Updated</TableHeaderCell>
                  <TableHeaderCell>Action</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row, idx) => (
                  <TableRow key={row.id} index={idx}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-text-primary dark:text-slate-100">
                          {row.studentName}
                        </div>
                        <div className="text-xs text-text-secondary dark:text-slate-400">
                          {row.studentNumber !== "--"
                            ? `Student No. ${row.studentNumber}`
                            : row.studentEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{row.placementTitle}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.placementStatus} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{row.evaluationCount} evaluation(s)</div>
                        <div className="text-xs text-text-secondary dark:text-slate-400">
                          {row.evaluationStatus}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-blue-600 dark:text-blue-400">
                      {formatScore(row.finalScore)}
                    </TableCell>
                    <TableCell>{row.lastUpdated}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewReport(row)}
                        disabled={activeReportId === row.id}
                      >
                        {activeReportId === row.id ? "Loading..." : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      {selectedReport ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-maroon dark:text-slate-100">
                  {selectedReport.row.studentName}
                </h3>
                <p className="mt-1 text-sm text-text-secondary dark:text-slate-400">
                  {selectedReport.row.placementTitle} •{" "}
                  {toTitleCase(selectedReport.data.report_type || reportType)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Internship Period
                </div>
                <div className="mt-2 text-sm text-text-primary dark:text-slate-100">
                  {formatDate(selectedReport.data.internship_start)} to{" "}
                  {formatDate(selectedReport.data.internship_end)}
                </div>
              </div>

              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Evaluation Score
                </div>
                <div className="mt-2 text-sm text-text-primary dark:text-slate-100">
                  {formatScore(selectedReport.data.evaluation_score)}
                </div>
              </div>

              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4 sm:col-span-2">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Summary Stats
                </div>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-900">
                    <div className="text-xs uppercase tracking-wider text-text-secondary dark:text-slate-400">
                      Total Weeks
                    </div>
                    <div className="mt-1 font-semibold text-text-primary dark:text-slate-100">
                      {selectedReport.data.summary_stats?.total_weeks ?? "--"}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-900">
                    <div className="text-xs uppercase tracking-wider text-text-secondary dark:text-slate-400">
                      First Week
                    </div>
                    <div className="mt-1 font-semibold text-text-primary dark:text-slate-100">
                      {selectedReport.data.summary_stats?.first_week ?? "--"}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-900">
                    <div className="text-xs uppercase tracking-wider text-text-secondary dark:text-slate-400">
                      Last Week
                    </div>
                    <div className="mt-1 font-semibold text-text-primary dark:text-slate-100">
                      {selectedReport.data.summary_stats?.last_week ?? "--"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4 sm:col-span-2">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Weekly Logs
                </div>
                <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-sm leading-relaxed text-text-primary dark:text-slate-100">
                  {selectedReport.data.logs || "No log summary available."}
                </pre>
              </div>

              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4 sm:col-span-2">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Supervisor Comments
                </div>
                <div className="mt-2 text-sm leading-relaxed text-text-primary dark:text-slate-100">
                  {selectedReport.data.supervisor_comments ||
                    "No supervisor comments were included in this report."}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Reports;
