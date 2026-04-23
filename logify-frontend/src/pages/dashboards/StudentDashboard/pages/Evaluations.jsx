import { useEffect, useMemo, useState } from "react";

import { api } from "../../../../config/api";

const formatPercentage = (value) => {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return "--";
  }

  return `${numericValue}%`;
};

const Evaluations = () => {
  const [evaluationData, setEvaluationData] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [evaluationCriteria, setEvaluationCriteria] = useState([]);
  const [evaluationCriteriaScores, setEvaluationCriteriaScores] = useState([]);
  const [academicSupervisor, setAcademicSupervisor] = useState(null);
  const [isLoadingEvaluationData, setIsLoadingEvaluationData] = useState(true);
  const [isLoadingFinalResult, setIsLoadingFinalResult] = useState(true);
  const [isLoadingEvaluationCriteria, setIsLoadingEvaluationCriteria] =
    useState(false);
  const [
    isLoadingEvaluationCriteriaScores,
    setIsLoadingEvaluationCriteriaScores,
  ] = useState(false);
  const [isLoadingAcademicSupervisor, setIsLoadingAcademicSupervisor] =
    useState(false);

  useEffect(() => {
    const loadPrimaryEvaluationData = async () => {
      setIsLoadingEvaluationData(true);
      setIsLoadingFinalResult(true);

      try {
        const [evaluationsResponse, resultsResponse] = await Promise.all([
          api.evaluations.getEvaluations(),
          api.evaluations.getResults(),
        ]);

        setEvaluationData(evaluationsResponse?.[0] ?? null);
        setFinalResult(resultsResponse?.[0] ?? null);
      } catch {
        setEvaluationData(null);
        setFinalResult(null);
      } finally {
        setIsLoadingEvaluationData(false);
        setIsLoadingFinalResult(false);
      }
    };

    loadPrimaryEvaluationData();
  }, []);

  useEffect(() => {
    if (!evaluationData?.evaluator) {
      setAcademicSupervisor(null);
      setIsLoadingAcademicSupervisor(false);
      return;
    }

    const fetchAcademicSupervisor = async () => {
      try {
        setIsLoadingAcademicSupervisor(true);
        const data = await api.accounts.getAcademicSupervisor(
          evaluationData.evaluator,
        );
        setAcademicSupervisor(data);
      } catch {
        setAcademicSupervisor(null);
      } finally {
        setIsLoadingAcademicSupervisor(false);
      }
    };

    fetchAcademicSupervisor();
  }, [evaluationData]);

  useEffect(() => {
    if (!evaluationData?.rubric) {
      setEvaluationCriteria([]);
      setEvaluationCriteriaScores([]);
      setIsLoadingEvaluationCriteria(false);
      setIsLoadingEvaluationCriteriaScores(false);
      return;
    }

    const fetchBreakdownData = async () => {
      try {
        setIsLoadingEvaluationCriteria(true);
        setIsLoadingEvaluationCriteriaScores(true);

        const [criteriaResponse, scoresResponse] = await Promise.all([
          api.evaluations.getCriteria(),
          api.evaluations.getScores(),
        ]);

        const filteredCriteria = (criteriaResponse ?? []).filter(
          (criterion) => criterion.rubric === evaluationData.rubric,
        );
        const filteredScores = (scoresResponse ?? []).filter(
          (score) => Number(score.evaluation) === Number(evaluationData.id),
        );

        setEvaluationCriteria(filteredCriteria);
        setEvaluationCriteriaScores(filteredScores);
      } catch {
        setEvaluationCriteria([]);
        setEvaluationCriteriaScores([]);
      } finally {
        setIsLoadingEvaluationCriteria(false);
        setIsLoadingEvaluationCriteriaScores(false);
      }
    };

    fetchBreakdownData();
  }, [evaluationData]);

  const scoreBreakdown = useMemo(
    () =>
      evaluationCriteria.map((criterion) => {
        const scoreObj = evaluationCriteriaScores.find(
          (score) => score.criterion === criterion.id,
        );
        const scoreValue = Number(scoreObj?.score ?? 0);
        const maxScore = Number(criterion.max_score ?? 100);
        const barWidth =
          maxScore > 0
            ? Math.max(
                0,
                Math.min(100, Math.round((scoreValue / maxScore) * 100)),
              )
            : Math.max(0, Math.min(100, scoreValue));

        return {
          ...criterion,
          scoreValue,
          barWidth,
        };
      }),
    [evaluationCriteria, evaluationCriteriaScores],
  );

  const academicRemarks =
    finalResult?.remarks || "Academic remarks unavailable";
  const workplaceFeedback =
    finalResult?.workplace_feedback || "Workplace feedback unavailable";

  return (
    <div className="dark:bg-slate-950 min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
          My <span className="text-gold">Evaluations</span>
        </h1>
        <p className="text-lg text-text-secondary/80 max-w-lg leading-relaxed">
          View your internship evaluations and performance scores across
          different criteria.
        </p>
      </header>

      <div className="space-y-8">
        <section>
          <div className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border transition-transform">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                Evaluation Status
              </h2>
              <p className="text-text-secondary text-md mt-1">
                Status of the final evaluation conducted during your internship
              </p>
            </div>

            {isLoadingEvaluationData ? (
              <p>Loading...</p>
            ) : evaluationData ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-6 p-6 bg-background/50 rounded-[12px] border border-border/30 transition-colors">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-maroon-dark">
                      Final Evaluation
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">
                      Evaluator:{" "}
                      {isLoadingAcademicSupervisor
                        ? "Loading..."
                        : academicSupervisor
                          ? `${academicSupervisor.first_name} ${academicSupervisor.last_name}`
                          : "Unavailable"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-text-secondary/40">
                      {formatPercentage(evaluationData.total_score)}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-amber-600 tracking-widest mt-1">
                      {evaluationData.status}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Evaluation unavailable</p>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <div className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border h-full">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                  Score Breakdown
                </h2>
                <p className="text-text-secondary text-md mt-1">
                  Detailed performance across key criteria
                </p>
              </div>
              {isLoadingEvaluationCriteria ||
              isLoadingEvaluationCriteriaScores ? (
                <p>Loading...</p>
              ) : scoreBreakdown.length > 0 ? (
                <div className="space-y-6">
                  {scoreBreakdown.map((item) => (
                    <div
                      className="px-3 pt-3 bg-background/50 rounded-[12px] transition-colors"
                      key={item.id}
                    >
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <span className="text-sm font-bold text-maroon-dark">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-text-secondary/60 ml-2 uppercase tracking-tighter">
                            ({item.weight_percent}% Weight)
                          </span>
                        </div>
                        <span className="text-sm font-black text-gold">
                          {item.scoreValue}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gold/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gold transition-all duration-500"
                          style={{ width: `${item.barWidth}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="pt-6 border-t border-border mt-8 flex justify-between items-center">
                    <span className="text-lg font-black text-maroon-dark">
                      Overall Performance
                    </span>
                    <span className="text-3xl font-black text-gold">
                      {formatPercentage(evaluationData?.total_score)}
                    </span>
                  </div>
                </div>
              ) : (
                <p>Score breakdown unavailable</p>
              )}
            </div>
          </section>

          <section>
            <div className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border transition-transform">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                  Final results
                </h2>
                <p className="text-text-secondary text-md mt-1">
                  Your final score recorded across your entire internship.
                </p>
              </div>
              {isLoadingFinalResult ? (
                <p>Loading...</p>
              ) : finalResult ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-6 p-4 bg-background/50 rounded-[12px] transition-colors">
                    <div className="flex-1 text-sm font-bold text-maroon-dark">
                      Academic Score
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-gold">
                        {formatPercentage(finalResult.academic_score)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-4 bg-background/50 rounded-[12px] transition-colors">
                    <div className="flex-1 text-sm font-bold text-maroon-dark">
                      Logbook Score
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-gold">
                        {formatPercentage(finalResult.logbook_score)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 border-border/100 border-t transition-all">
                    <div className="flex-1 font-bold text-3xl text-maroon-dark">
                      Final Score
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-text-secondary/40">
                        {formatPercentage(finalResult.final_score)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 border-border/100 border-t transition-all">
                    <div className="flex-1 font-bold text-3xl text-maroon-dark">
                      Grade
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-text-secondary/40">
                        {finalResult.final_grade}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Final results unavailable</p>
              )}
            </div>
          </section>

          <section>
            <div className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border h-full">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                  Academic Remarks
                </h2>
                <p className="text-text-secondary text-md mt-1">
                  Feedback recorded by your academic supervisor
                </p>
              </div>
              {isLoadingFinalResult ? (
                <p>Loading...</p>
              ) : finalResult ? (
                <div className="p-8 bg-background/50 rounded-[12px] border border-border/30 text-text-secondary leading-relaxed">
                  {academicRemarks}
                </div>
              ) : (
                <p>Academic remarks unavailable</p>
              )}
            </div>
          </section>

          <section>
            <div className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border h-full">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                  Workplace Feedback
                </h2>
                <p className="text-text-secondary text-md mt-1">
                  Comments from your place of internship
                </p>
              </div>
              {isLoadingFinalResult ? (
                <p>Loading...</p>
              ) : finalResult ? (
                <div className="p-8 bg-background/50 rounded-[12px] border border-border/30 italic text-text-secondary leading-relaxed relative">
                  <span className="absolute top-4 left-4 text-4xl text-gold/20 font-serif">
                    &quot;
                  </span>
                  {workplaceFeedback}
                  <div className="mt-8 not-italic flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-maroonCustom flex items-center justify-center text-white font-bold text-xs">
                      {academicSupervisor?.first_name?.[0]}
                      {academicSupervisor?.last_name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-maroon-dark">
                        {academicSupervisor?.first_name}{" "}
                        {academicSupervisor?.last_name}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-text-secondary/60 tracking-widest">
                        Academic Supervisor
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Workplace feedback unavailable</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Evaluations;
