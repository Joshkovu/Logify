import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "../../../../components/ui/ThemeToggle";
import {
  Clock,
  Star,
  Award,
  MessageSquare,
  ChevronRight,
  Send,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../../../config/api";
import {
  buildEvaluationCriteria,
  formatDate,
  getPlacementProgress,
  getUserDisplayName,
  loadAcademicSupervisorData,
} from "../utils/academicSupervisorData";

const mapEvaluationRecord = ({
  evaluation,
  placementById,
  usersById,
  organizationsById,
  scores,
  criteriaById,
  resultByPlacementId,
  feedbackDrafts,
  scoreDrafts,
}) => {
  const placement = placementById[evaluation.placement];
  const student = placement ? usersById[placement.intern] : null;
  const organization = placement
    ? organizationsById[placement.organization]
    : null;
  const finalResult = resultByPlacementId[evaluation.placement];
  const { weekLabel } = placement
    ? getPlacementProgress(placement)
    : { weekLabel: "Schedule unavailable" };
  const criteria = buildEvaluationCriteria({
    evaluation,
    scores,
    criteriaById,
  });
  const feedbackFromScores = criteria
    .map((item) => item.comment)
    .filter(Boolean)
    .join("\n\n");
  const feedback =
    feedbackDrafts[evaluation.id] ||
    finalResult?.remarks ||
    finalResult?.workplace_feedback ||
    feedbackFromScores;

  return {
    id: evaluation.id,
    placementId: evaluation.placement,
    rubricId: evaluation.rubric,
    finalResultId: finalResult?.id || null,
    category: evaluation.status === "reviewed" ? "history" : "pending",
    name: placement ? getUserDisplayName(student, "Intern") : "Intern",
    type:
      evaluation.status === "reviewed"
        ? "Final Evaluation"
        : "Pending Evaluation",
    company: organization?.name || "Unknown organization",
    status:
      evaluation.status === "reviewed"
        ? "Authorized"
        : evaluation.status === "submitted"
          ? "Awaiting Review"
          : "In Progress",
    program: placement?.internship_title || "Placement unavailable",
    week: weekLabel,
    score: Math.round(finalResult?.final_score || evaluation.total_score || 0),
    finalGrade: finalResult?.final_grade || "Pending",
    logbookScore: finalResult?.logbook_score ?? null,
    academicScore: finalResult?.academic_score ?? null,
    feedback: feedback || "",
    date: formatDate(evaluation.updated_at || evaluation.submitted_at),
    criteria,
  };
};

const Evaluation = () => {
  const [isDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [snapshot, setSnapshot] = useState({
    evaluations: [],
    scores: [],
    criteriaById: {},
    placementById: {},
    resultByPlacementId: {},
    usersById: {},
    organizationsById: {},
  });
  const [selectedEvaluationId, setSelectedEvaluationId] = useState(null);

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
          evaluations: data.evaluations,
          scores: data.scores,
          criteriaById: data.criteriaById,
          placementById: data.placementById,
          resultByPlacementId: data.resultByPlacementId,
          usersById: data.usersById,
          organizationsById: data.organizationsById,
        });
      } catch (loadError) {
        setError(loadError.message || "Unable to load evaluations.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const {
    evaluations,
    scores,
    criteriaById,
    placementById,
    resultByPlacementId,
    usersById,
    organizationsById,
  } = snapshot;

  const records = useMemo(
    () =>
      evaluations.map((evaluation) =>
        mapEvaluationRecord({
          evaluation,
          placementById,
          usersById,
          organizationsById,
          scores,
          criteriaById,
          resultByPlacementId,
          feedbackDrafts,
        }),
      ),
    [
      criteriaById,
      evaluations,
      feedbackDrafts,
      organizationsById,
      placementById,
      resultByPlacementId,
      scores,
      usersById,
    ],
  );

  const pendingEvaluations = useMemo(
    () => records.filter((item) => item.category === "pending"),
    [records],
  );

  const completedEvaluations = useMemo(
    () => records.filter((item) => item.category === "history"),
    [records],
  );

  useEffect(() => {
    if (!selectedEvaluationId && records.length > 0) {
      setSelectedEvaluationId(records[0].id);
    }
    if (
      selectedEvaluationId &&
      !records.some((item) => item.id === selectedEvaluationId)
    ) {
      setSelectedEvaluationId(records[0]?.id || null);
    }
  }, [records, selectedEvaluationId]);

  const selectedEvaluation = useMemo(
    () => records.find((item) => item.id === selectedEvaluationId) || null,
    [records, selectedEvaluationId],
  );

  const handleSelectRecord = (item) => {
    setSelectedEvaluationId(item.id);
  };

  const handleFeedbackChange = (value) => {
    if (!selectedEvaluation || selectedEvaluation.category !== "pending") {
      return;
    }

    setFeedbackDrafts((current) => ({
      ...current,
      [selectedEvaluation.id]: value,
    }));
  };

  const upsertFinalResultForEvaluation = async ({
    evaluationId,
    placementId,
    rubricId,
    finalResultId,
    remarks,
  }) => {
    const payload = {
      placement: placementId,
      rubric: rubricId,
      remarks,
    };

    const result = finalResultId
      ? await api.evaluations.patchResult(finalResultId, payload)
      : await api.evaluations.createResult(payload);

    setSnapshot((current) => ({
      ...current,
      resultByPlacementId: {
        ...current.resultByPlacementId,
        [placementId]: result,
      },
    }));

    setFeedbackDrafts((current) => ({
      ...current,
      [evaluationId]: result.remarks || remarks || "",
    }));

    return result;
  };

  const handleSaveReview = async () => {
    if (!selectedEvaluation || selectedEvaluation.category !== "pending") {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await upsertFinalResultForEvaluation({
        evaluationId: selectedEvaluation.id,
        placementId: selectedEvaluation.placementId,
        rubricId: selectedEvaluation.rubricId,
        finalResultId: selectedEvaluation.finalResultId,
        remarks: selectedEvaluation.feedback,
      });
      await api.evaluations.patchEvaluation(selectedEvaluation.id, {
        status: "submitted",
      });
      setSnapshot((current) => ({
        ...current,
        evaluations: current.evaluations.map((evaluation) =>
          evaluation.id === selectedEvaluation.id
            ? { ...evaluation, status: "submitted" }
            : evaluation,
        ),
      }));
      toast.success("Evaluation submitted successfully");
    } catch (saveError) {
      const message = saveError.message || "Unable to save this review.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAuthorizeRequest = async () => {
    if (!selectedEvaluation || selectedEvaluation.category !== "pending") {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const result = await upsertFinalResultForEvaluation({
        evaluationId: selectedEvaluation.id,
        placementId: selectedEvaluation.placementId,
        rubricId: selectedEvaluation.rubricId,
        finalResultId: selectedEvaluation.finalResultId,
        remarks: selectedEvaluation.feedback,
      });
      await api.evaluations.patchEvaluation(selectedEvaluation.id, {
        status: "reviewed",
      });
      setSnapshot((current) => ({
        ...current,
        evaluations: current.evaluations.map((evaluation) =>
          evaluation.id === selectedEvaluation.id
            ? { ...evaluation, status: "reviewed" }
            : evaluation,
        ),
        resultByPlacementId: {
          ...current.resultByPlacementId,
          [selectedEvaluation.placementId]: result,
        },
      }));
      toast.success("Evaluation authorized successfully");
    } catch (saveError) {
      const message =
        saveError.message || "Unable to authorize this evaluation.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewAuthorizedRecord = () => {
    if (!selectedEvaluation || selectedEvaluation.category !== "history") {
      return;
    }

    setSelectedEvaluationId(selectedEvaluation.id);
  };

  const sectionCardClassName =
    "rounded-[12px] border border-border bg-card text-card-foreground p-4 transition-all hover:scale-[1.005] sm:p-6 lg:p-8 xl:p-10";

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
      <div className="mb-5 -mx-4 flex items-center justify-between border-b border-border px-4 pb-1.5 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 xl:-mx-12 xl:px-12">
        <h1 className="text-sm font-bold uppercase tracking-[0.18em] text-black/70 dark:text-slate-300 sm:text-base">
          LOGIFY ACADEMIC SUPERVISOR
        </h1>

        <ThemeToggle />
      </div>

      <header className="mb-8 sm:mb-10 lg:mb-12">
        <h1 className="mb-3 text-3xl font-black tracking-tighter text-maroon-dark dark:text-white sm:text-4xl lg:text-5xl">
          Student <span className="text-gold">Evaluations</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
          Assess intern performance across key academic and professional
          competencies.
        </p>
        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        )}
      </header>

      <section className="mb-8">
        <div className={sectionCardClassName}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gold/10 p-2 text-gold dark:text-slate-300">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
                Pending Evaluations
              </h2>
              <p className="text-sm text-muted-foreground">
                Students requiring your assessment
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingEvaluations.length > 0 ? (
              pendingEvaluations.map((item) => {
                const isActive = selectedEvaluation?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectRecord(item)}
                    className={`group flex w-full flex-col gap-4 rounded-2xl border p-4 text-left transition-all sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
                      isActive
                        ? "border-gold/20 bg-gold/5 dark:border-slate-700 dark:bg-slate-800"
                        : "border-border bg-muted hover:bg-muted/70"
                    }`}
                  >
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold dark:text-slate-300">
                        <Star size={24} />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-maroon-dark dark:text-slate-300 sm:text-base">
                          {item.name}
                          <span className="font-medium text-muted-foreground">
                            {" "}
                            &bull; {item.type}
                          </span>
                        </h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {item.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gold dark:text-slate-300">
                        {item.status}
                      </span>
                      <ChevronRight
                        className={`transition-transform ${
                          isActive
                            ? "translate-x-1 text-gold"
                            : "text-gold group-hover:translate-x-1 dark:text-slate-300"
                        }`}
                        size={20}
                      />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center">
                <p className="text-sm font-semibold text-muted-foreground">
                  {isLoading
                    ? "Loading evaluations..."
                    : "No pending evaluations at the moment."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedEvaluation && (
        <section className="mb-8">
          <div className={sectionCardClassName}>
            <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="mb-2 w-fit rounded-full bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gold dark:text-slate-300">
                  {selectedEvaluation.category === "pending"
                    ? "Active Assessment"
                    : "Authorized Record"}
                </div>

                <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl lg:text-3xl">
                  {selectedEvaluation.type} - {selectedEvaluation.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  {selectedEvaluation.program} &bull; {selectedEvaluation.week}
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedEvaluation.company}
                </p>

                {selectedEvaluation.category === "history" &&
                  selectedEvaluation.date && (
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                      Authorized on {selectedEvaluation.date}
                    </p>
                  )}
              </div>

              <div
                className={`w-full rounded-2xl p-6 text-center lg:w-[220px] ${
                  selectedEvaluation.category === "pending"
                    ? "bg-maroon-dark"
                    : "bg-emerald-700"
                }`}
              >
                <div className="mb-1 text-4xl font-black leading-none text-white sm:text-5xl">
                  {selectedEvaluation.score}%
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                  Final Score
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-6 text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
                Performance Criteria
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {selectedEvaluation.criteria.map((item) => (
                  <div
                    key={`${selectedEvaluation.id}-${item.title}`}
                    className="rounded-2xl border border-border bg-muted p-4 sm:p-5"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="max-w-2xl min-w-0">
                        <h4 className="text-base font-bold text-maroon-dark dark:text-slate-300 sm:text-lg">
                          {item.title}
                          <span className="text-sm font-medium text-muted-foreground/70">
                            {" "}
                            ({item.weight} Weight)
                          </span>
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.note}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-maroon-dark dark:text-slate-300 sm:text-xl">
                          {item.score}
                          <span className="text-sm opacity-30">/100</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold dark:text-slate-300">
                          Contrib: {item.contribution}
                        </p>
                      </div>
                    </div>

                    <div className="h-3 w-full overflow-hidden rounded-full border border-border/30 bg-background">
                      <div
                        className="h-full rounded-full bg-maroonCustom transition-all duration-1000 dark:bg-gold"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-border bg-card text-card-foreground">
              <div className="rounded-2xl border border-border/30 bg-muted p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex items-start gap-4">
                  <div className="rounded-xl bg-gold/10 p-3 text-gold dark:text-slate-300">
                    <MessageSquare size={24} />
                  </div>

                  <div className="flex-1">
                    <h3 className="mb-4 text-xl font-black tracking-tight text-maroon-dark dark:text-white">
                      Overall Feedback
                    </h3>

                    {selectedEvaluation.category === "pending" ? (
                      <textarea
                        value={selectedEvaluation.feedback}
                        onChange={(e) => handleFeedbackChange(e.target.value)}
                        className="min-h-[150px] w-full rounded-2xl border border-border/30 bg-card p-4 font-medium text-muted-foreground outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20 dark:text-slate-200 sm:p-6"
                        placeholder="Provide qualitative feedback on the student's overall growth, technical agility, and professional conduct..."
                      />
                    ) : (
                      <div className="min-h-[150px] rounded-2xl border border-border/30 bg-card p-4 font-medium text-muted-foreground dark:text-slate-200 sm:p-6">
                        {selectedEvaluation.feedback ||
                          "No feedback was recorded."}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-4">
                  {selectedEvaluation.category === "pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveReview}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-4 py-2 text-sm font-bold text-gold transition-colors hover:text-maroon disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-300"
                      >
                        <Send size={18} />
                        {isSaving ? "Saving..." : "Save Review"}
                      </button>

                      <button
                        type="button"
                        onClick={handleAuthorizeRequest}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-lg border border-emerald-700 bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <CheckCircle2 size={18} />
                        {isSaving ? "Authorizing..." : "Authorize Request"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleViewAuthorizedRecord}
                      className="flex items-center gap-2 rounded-lg border border-emerald-700 bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                      <FileText size={18} />
                      View Authorized Record
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className={sectionCardClassName}>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
              Evaluation History
            </h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Archive of previously authorized assessments
            </p>
          </div>

          <div className="space-y-4">
            {completedEvaluations.map((item) => {
              const isActive = selectedEvaluation?.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectRecord(item)}
                  className={`group flex w-full flex-col gap-4 rounded-2xl border p-4 text-left transition-all sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
                    isActive
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20"
                      : "border-border bg-muted hover:bg-muted/70"
                  }`}
                >
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      <Award size={24} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-maroon-dark dark:text-slate-300 sm:text-base">
                        {item.name}
                        <span className="font-medium"> &bull; {item.type}</span>
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {item.company} &bull; Submitted on {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 sm:justify-end sm:gap-8">
                    <div className="text-right">
                      <div className="text-2xl font-black leading-none text-emerald-600 dark:text-emerald-400">
                        {item.score}%
                      </div>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                        {item.finalGrade}
                      </p>
                    </div>

                    <ChevronRight
                      size={20}
                      className={`transition-transform ${
                        isActive
                          ? "translate-x-1 text-emerald-700 dark:text-emerald-400"
                          : "text-muted-foreground/40 group-hover:translate-x-1 group-hover:text-maroon-dark dark:group-hover:text-white"
                      }`}
                    />
                  </div>
                </button>
              );
            })}

            {!isLoading && completedEvaluations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center">
                <p className="text-sm font-semibold text-muted-foreground">
                  No authorized evaluations yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Evaluation;
