import { useState, useEffect } from "react";
import { api } from "../../../../config/api";
const Evaluations = () => {
  const [evaluationData, setEvaluationData] = useState(null);
  const [isLoadingEvaluationData, setIsLoadingEvaluationData] = useState(true);
  const [evaluationCriteria, setEvaluationCriteria] = useState([]);
  const [isLoadingEvaluationCriteria, setIsLoadingEvaluationCriteria] =
    useState(false);
  const [evaluationCriteriaScores, setEvaluationCriteriaScores] = useState([]);
  const [
    isLoadingEvaluationCriteriaScores,
    setIsLoadingEvaluationCriteriaScores,
  ] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [isLoadingFinalResult, setIsLoadingFinalResult] = useState(true);
  const [academicSupervisor, setAcademicSupervisor] = useState(null);
  const [isLoadingAcademicSupervisor, setIsLoadingAcademicSupervisor] =
    useState(null);

  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        setIsLoadingEvaluationData(true);
        const data = await api.evaluations.getEvaluations();
        setEvaluationData(data[0]);
        console.log("Evaluation Data: ", data);
      } catch (err) {
        console.error("Failed to fetch Evaluation Data: ", err.message);
      } finally {
        setIsLoadingEvaluationData(false);
      }
    };
    fetchEvaluationData();
  }, []);
  useEffect(() => {
    const fetchFinalResult = async () => {
      try {
        setIsLoadingFinalResult(true);
        const data = await api.evaluations.getResults();
        setFinalResult(data[0]);
        console.log("Final Result: ", data);
      } catch (err) {
        console.error("Failed to fetch Final Result: ", err.message);
      } finally {
        setIsLoadingFinalResult(false);
      }
    };
    fetchFinalResult();
  }, []);

  useEffect(() => {
    if (evaluationData) {
      const fetchAcademicSupervisor = async () => {
        try {
          setIsLoadingAcademicSupervisor(true);
          const data = await api.accounts.getAcademicSupervisor(
            evaluationData.evaluator,
          );
          setAcademicSupervisor(data);
          console.log("Academic sup: ", data);
        } catch (err) {
          console.error("Failed to fetch academic sup: ", err.message);
        } finally {
          setIsLoadingAcademicSupervisor(false);
        }
      };
      fetchAcademicSupervisor();
    }
  }, [evaluationData]);
  useEffect(() => {
    if (evaluationData) {
      const fetchEvaluationCriteria = async () => {
        try {
          setIsLoadingEvaluationCriteria(true);
          const data = await api.evaluations.getCriteria();
          const filtered = data.filter(
            (c) => c.rubric === evaluationData.rubric,
          );
          console.log("filtered criteria: ", filtered);
          setEvaluationCriteria(filtered);
        } catch (err) {
          console.error("Failed to fetch Eval Crit: ", err.message);
        } finally {
          setIsLoadingEvaluationCriteria(false);
        }
      };
      fetchEvaluationCriteria();
    }
  }, [evaluationData]);
  useEffect(() => {
    if (evaluationData) {
      const fetchEvaluationCriteriaScores = async () => {
        try {
          setIsLoadingEvaluationCriteriaScores(true);
          const data = await api.evaluations.getScores();
          const filtered = data.filter(
            (s) => Number(s.evaluation) === Number(evaluationData.id),
          );
          setEvaluationCriteriaScores(filtered);
        } catch (err) {
          console.error("Failed to fetch Eval Crit Scores: ", err.message);
        } finally {
          setIsLoadingEvaluationCriteriaScores(false);
        }
      };
      fetchEvaluationCriteriaScores();
    }
  }, [evaluationData]);

  console.log("criteria loading:", isLoadingEvaluationCriteria);
  console.log("scores loading:", isLoadingEvaluationCriteriaScores);
  console.log("criteria length:", evaluationCriteria.length);
  console.log("scores length:", evaluationCriteriaScores.length);

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
            ) : !isLoadingEvaluationData && evaluationData ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-6 p-6 bg-background/50 rounded-[12px] border border-border/30 transition-colors">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-maroon-dark">
                      Final Evaluation
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">
                      Evaluator: {academicSupervisor?.first_name}{" "}
                      {academicSupervisor?.last_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-text-secondary/40">
                      {evaluationData?.total_score}%
                    </div>
                    <div className="text-[10px] uppercase font-bold text-amber-600 tracking-widest mt-1">
                      {evaluationData?.status}
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
              ) : !isLoadingEvaluationCriteria &&
                !isLoadingEvaluationCriteriaScores &&
                evaluationCriteria.length > 0 &&
                evaluationCriteriaScores.length > 0 ? (
                <div className="space-y-6">
                  {evaluationCriteria.map((item, i) => {
                    const scoreObj = evaluationCriteriaScores.find(
                      (s) => s.criterion === item.id,
                    );
                    const score = scoreObj?.score ?? 0;
                    return (
                      <div
                        className="px-3 pt-3 bg-background/50 rounded-[12px] transition-colors"
                        key={i}
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
                            {score}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gold/10 rounded-full overflow-hidden"></div>
                      </div>
                    );
                  })}

                  <div className="pt-6 border-t border-border mt-8 flex justify-between items-center">
                    <span className="text-lg font-black text-maroon-dark">
                      Overall Performance
                    </span>
                    <span className="text-3xl font-black text-gold">
                      {evaluationData?.total_score}%
                    </span>
                  </div>
                </div>
              ) : (
                <p>Score breakdown unavailable</p>
              )}{" "}
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
              ) : !isLoadingFinalResult && finalResult ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-6 p-4 bg-background/50 rounded-[12px] transition-colors">
                    <div className="flex-1 text-sm font-bold text-maroon-dark">
                      Academic Score
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-gold">
                        {finalResult?.academic_score}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-4 bg-background/50 rounded-[12px] transition-colors">
                    <div className="flex-1 text-sm font-bold text-maroon-dark">
                      Logbook Score
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-gold">
                        {finalResult?.logbook_score}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 border-border/100 border-t transition-all">
                    <div className="flex-1 font-bold text-3xl text-maroon-dark">
                      Final Score
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-text-secondary/40">
                        {finalResult?.final_score}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 border-border/100 border-t transition-all">
                    <div className="flex-1 font-bold text-3xl text-maroon-dark">
                      Grade
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-text-secondary/40">
                        {finalResult?.final_grade}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Final results unavailable</p>
              )}{" "}
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
              {isLoadingAcademicSupervisor || isLoadingFinalResult ? (
                <p>Loading...</p>
              ) : !isLoadingAcademicSupervisor &&
                !isLoadingFinalResult &&
                academicSupervisor &&
                finalResult ? (
                <div className="p-8 bg-background/50 rounded-[12px] border border-border/30 italic text-text-secondary leading-relaxed relative">
                  <span className="absolute top-4 left-4 text-4xl text-gold/20 font-serif">
                    &quot;
                  </span>
                  {finalResult?.workplace_feedback}
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
                        Evaluator
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Workplace feedback unavailable</p>
              )}{" "}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Evaluations;
