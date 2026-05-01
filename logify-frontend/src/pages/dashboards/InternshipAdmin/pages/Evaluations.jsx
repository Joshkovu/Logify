import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import StatusBadge from "../../../../components/ui/StatusBadge";
import { Button } from "../../../../components/ui/Button";
import { api } from "../../../../config/api";

const normalizeCollection = (payload, key) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const toDisplayName = (student = {}) => {
  const fullName = [
    student.full_name,
    student.name,
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

const getEvaluationTimestamp = (evaluation) =>
  evaluation.submitted_at ||
  evaluation.updated_at ||
  evaluation.created_at ||
  0;

const formatScore = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric) || numeric <= 0) return "--";
  return `${numeric.toFixed(1)}%`;
};

const Evaluations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [results, setResults] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      const [
        evaluationsResult,
        resultsResult,
        placementsResult,
        studentsResult,
      ] = await Promise.allSettled([
        api.evaluations.getEvaluations(),
        api.evaluations.getResults(),
        api.placements.getPlacements(),
        api.registry.getStudents(),
      ]);

      if (!isMounted) return;

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
      setPlacements(
        placementsResult.status === "fulfilled"
          ? normalizeCollection(placementsResult.value, "placements")
          : [],
      );
      setStudents(
        studentsResult.status === "fulfilled"
          ? normalizeCollection(studentsResult.value, "students")
          : [],
      );

      if (
        [
          evaluationsResult,
          resultsResult,
          placementsResult,
          studentsResult,
        ].every((result) => result.status === "rejected")
      ) {
        setError("Unable to load evaluation records right now.");
      }

      setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const placementMap = placements.reduce((acc, placement) => {
    acc[String(placement.id)] = placement;
    return acc;
  }, {});

  const studentMap = students.reduce((acc, student) => {
    acc[String(student.id)] = student;
    return acc;
  }, {});

  const resultByPlacementId = results.reduce((acc, result) => {
    acc[String(result.placement)] = result;
    return acc;
  }, {});

  const evaluationRows = evaluations
    .map((evaluation) => {
      const placement = placementMap[String(evaluation.placement)] || null;
      const student = placement
        ? studentMap[String(placement.intern)] || null
        : null;
      const result = resultByPlacementId[String(evaluation.placement)] || null;

      return {
        id: evaluation.id,
        placementId: evaluation.placement,
        studentName: toDisplayName(student || {}),
        studentNumber: student?.student_number || "--",
        studentEmail: student?.webmail || student?.email || "--",
        internshipTitle: placement?.internship_title || "Untitled Internship",
        placementStatus: toTitleCase(String(placement?.status || "draft")),
        evaluationType: toTitleCase(
          String(evaluation.evaluator_type || "evaluation"),
        ),
        evaluatorLabel: `${toTitleCase(String(evaluation.evaluator_type || "evaluator"))}${evaluation.evaluator ? ` #${evaluation.evaluator}` : ""}`,
        status: toTitleCase(String(evaluation.status || "draft")),
        totalScore: Number(evaluation.total_score || 0),
        displayScore: formatScore(evaluation.total_score),
        finalScore: result ? Number(result.final_score || 0) : null,
        finalGrade: result?.final_grade || "--",
        remarks: result?.remarks || result?.workplace_feedback || "--",
        date: formatDate(getEvaluationTimestamp(evaluation)),
        submittedAt: formatDate(evaluation.submitted_at),
        computedAt: formatDate(result?.computed_at),
        raw: evaluation,
      };
    })
    .sort(
      (a, b) =>
        new Date(getEvaluationTimestamp(b.raw)).getTime() -
        new Date(getEvaluationTimestamp(a.raw)).getTime(),
    );

  const filteredEvaluations = evaluationRows.filter((evaluation) =>
    [
      evaluation.studentName,
      evaluation.studentNumber,
      evaluation.studentEmail,
      evaluation.internshipTitle,
      evaluation.evaluationType,
      evaluation.evaluatorLabel,
      evaluation.status,
      evaluation.finalGrade,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const totalEvaluations = evaluationRows.length;
  const completedEvaluations = evaluationRows.filter(
    (evaluation) => evaluation.status === "Reviewed",
  ).length;
  const pendingEvaluations = evaluationRows.filter((evaluation) =>
    ["Draft", "Submitted"].includes(evaluation.status),
  ).length;
  const averageScore = (() => {
    const scores = results.length
      ? results
          .map((result) => Number(result.final_score || 0))
          .filter((score) => !Number.isNaN(score) && score > 0)
      : evaluationRows
          .map((evaluation) => evaluation.totalScore)
          .filter((score) => !Number.isNaN(score) && score > 0);

    if (scores.length === 0) return "0.0%";

    return `${(scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)}%`;
  })();

  const stats = [
    {
      label: "Total Evaluations",
      value: loading ? "..." : totalEvaluations,
      valueClassName: "text-green-500 dark:text-emerald-400",
    },
    {
      label: "Completed",
      value: loading ? "..." : completedEvaluations,
      valueClassName: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Pending",
      value: loading ? "..." : pendingEvaluations,
      valueClassName: "text-amber-500 dark:text-amber-300",
    },
    {
      label: "Average Score",
      value: loading ? "..." : averageScore,
      valueClassName: "text-blue-700 dark:text-blue-400",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-maroon dark:text-slate-300 sm:text-4xl">
          Evaluation Overview
        </h1>
        <p className="text-sm text-text-secondary dark:text-slate-300 sm:text-base lg:text-lg">
          Monitor all student evaluations across the system
        </p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8"
          >
            <span className="mb-1 text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest">
              {stat.label}
            </span>
            <span className={`text-3xl font-extrabold ${stat.valueClassName}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-maroon dark:text-slate-300 mb-1">
              Recent Evaluations
            </h2>
            <p className="text-text-secondary dark:text-slate-300">
              {loading
                ? "Loading evaluation records..."
                : `Showing ${filteredEvaluations.length} of ${totalEvaluations} evaluations`}
            </p>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search evaluations..."
            className="w-full rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold sm:min-w-72"
          />
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        <Table>
          <TableHead>
            <TableRow index={0}>
              <TableHeaderCell>Student</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Evaluator</TableHeaderCell>
              <TableHeaderCell>Score</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvaluations.length > 0 ? (
              filteredEvaluations.map((evaluation, idx) => (
                <TableRow key={evaluation.id} index={idx}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-text-primary dark:text-slate-100">
                        {evaluation.studentName}
                      </div>
                      <div className="text-xs text-text-secondary dark:text-slate-400">
                        {evaluation.internshipTitle}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{evaluation.evaluationType}</TableCell>
                  <TableCell>{evaluation.evaluatorLabel}</TableCell>
                  <TableCell className="text-blue-600 dark:text-blue-400 font-medium">
                    {evaluation.displayScore}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={evaluation.status} />
                  </TableCell>
                  <TableCell>{evaluation.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedEvaluation(evaluation)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow index={0}>
                <TableCell colSpan={7}>
                  <div className="py-6 text-center text-sm text-text-secondary dark:text-slate-400">
                    {loading
                      ? "Loading evaluations..."
                      : "No evaluations matched the current search."}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {selectedEvaluation ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-maroon dark:text-slate-100">
                  {selectedEvaluation.studentName}
                </h3>
                <p className="mt-1 text-sm text-text-secondary dark:text-slate-400">
                  {selectedEvaluation.internshipTitle}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEvaluation(null)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Student
                </div>
                <div className="mt-2 font-semibold text-text-primary dark:text-slate-100">
                  {selectedEvaluation.studentName}
                </div>
                <div className="mt-1 text-sm text-text-secondary dark:text-slate-400">
                  {selectedEvaluation.studentNumber !== "--"
                    ? `Student No. ${selectedEvaluation.studentNumber}`
                    : selectedEvaluation.studentEmail}
                </div>
              </div>

              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Evaluation
                </div>
                <div className="mt-2 font-semibold text-text-primary dark:text-slate-100">
                  {selectedEvaluation.evaluationType}
                </div>
                <div className="mt-1 text-sm text-text-secondary dark:text-slate-400">
                  {selectedEvaluation.evaluatorLabel}
                </div>
              </div>

              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Progress
                </div>
                <div className="mt-2">
                  <StatusBadge status={selectedEvaluation.status} />
                </div>
                <div className="mt-2 text-sm text-text-secondary dark:text-slate-400">
                  Placement status: {selectedEvaluation.placementStatus}
                </div>
              </div>

              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Scores
                </div>
                <div className="mt-2 font-semibold text-text-primary dark:text-slate-100">
                  Evaluation Score: {selectedEvaluation.displayScore}
                </div>
                <div className="mt-1 text-sm text-text-secondary dark:text-slate-400">
                  Final Score: {formatScore(selectedEvaluation.finalScore)}
                </div>
                <div className="mt-1 text-sm text-text-secondary dark:text-slate-400">
                  Grade: {selectedEvaluation.finalGrade}
                </div>
              </div>

              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4 sm:col-span-2">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Timeline
                </div>
                <div className="mt-2 text-sm text-text-primary dark:text-slate-100">
                  Submitted: {selectedEvaluation.submittedAt}
                </div>
                <div className="mt-1 text-sm text-text-primary dark:text-slate-100">
                  Finalized: {selectedEvaluation.computedAt}
                </div>
              </div>

              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4 sm:col-span-2">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Remarks
                </div>
                <div className="mt-2 text-sm leading-relaxed text-text-primary dark:text-slate-100">
                  {selectedEvaluation.remarks}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Evaluations;
