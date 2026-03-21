import { useMemo, useState } from "react";
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

const Evaluation = () => {
  const initialPendingEvaluations = [
    {
      id: 1,
      category: "pending",
      name: "Sarah Johnson",
      type: "Mid-Term Evaluation",
      company: "TechCorp Solutions Inc.",
      status: "In Progress",
      program: "Software Engineering",
      week: "Week 8 of 12",
      score: 86,
      feedback: "",
      date: "",
      criteria: [
        {
          title: "Technical Skills",
          weight: "30%",
          score: 88,
          note: "Ability to apply technical knowledge and skills",
          contribution: "26%",
        },
        {
          title: "Communication",
          weight: "20%",
          score: 85,
          note: "Written and verbal communication effectiveness",
          contribution: "17%",
        },
        {
          title: "Professionalism",
          weight: "20%",
          score: 90,
          note: "Work ethic and professional conduct",
          contribution: "18%",
        },
        {
          title: "Initiative",
          weight: "15%",
          score: 82,
          note: "Self-motivation and proactive approach",
          contribution: "12%",
        },
        {
          title: "Problem Solving",
          weight: "15%",
          score: 85,
          note: "Analytical thinking and solution development",
          contribution: "13%",
        },
      ],
    },
    {
      id: 2,
      category: "pending",
      name: "Michael Brown",
      type: "Final Evaluation",
      company: "NovaSoft Labs",
      status: "Awaiting Review",
      program: "Information Systems",
      week: "Week 12 of 12",
      score: 91,
      feedback: "",
      date: "",
      criteria: [
        {
          title: "Technical Skills",
          weight: "30%",
          score: 93,
          note: "Ability to apply technical knowledge and skills",
          contribution: "28%",
        },
        {
          title: "Communication",
          weight: "20%",
          score: 89,
          note: "Written and verbal communication effectiveness",
          contribution: "18%",
        },
        {
          title: "Professionalism",
          weight: "20%",
          score: 92,
          note: "Work ethic and professional conduct",
          contribution: "18%",
        },
        {
          title: "Initiative",
          weight: "15%",
          score: 88,
          note: "Self-motivation and proactive approach",
          contribution: "13%",
        },
        {
          title: "Problem Solving",
          weight: "15%",
          score: 90,
          note: "Analytical thinking and solution development",
          contribution: "14%",
        },
      ],
    },
  ];

  const initialCompletedEvaluations = [
    {
      id: 101,
      category: "history",
      name: "Robert Kim",
      type: "Mid-Term Evaluation",
      company: "DataTech Analytics",
      date: "Feb 18, 2026",
      score: 88,
      status: "Authorized",
      program: "Data Science",
      week: "Week 8 of 12",
      feedback:
        "Strong technical execution and dependable communication throughout the evaluation period.",
      criteria: [
        {
          title: "Technical Skills",
          weight: "30%",
          score: 89,
          note: "Ability to apply technical knowledge and skills",
          contribution: "27%",
        },
        {
          title: "Communication",
          weight: "20%",
          score: 84,
          note: "Written and verbal communication effectiveness",
          contribution: "17%",
        },
        {
          title: "Professionalism",
          weight: "20%",
          score: 90,
          note: "Work ethic and professional conduct",
          contribution: "18%",
        },
        {
          title: "Initiative",
          weight: "15%",
          score: 87,
          note: "Self-motivation and proactive approach",
          contribution: "13%",
        },
        {
          title: "Problem Solving",
          weight: "15%",
          score: 88,
          note: "Analytical thinking and solution development",
          contribution: "13%",
        },
      ],
    },
    {
      id: 102,
      category: "history",
      name: "Lisa Wang",
      type: "Mid-Term Evaluation",
      company: "CloudNet Systems",
      date: "Feb 12, 2026",
      score: 92,
      status: "Authorized",
      program: "Cloud Computing",
      week: "Week 8 of 12",
      feedback:
        "Excellent ownership, professionalism, and technical depth. Delivered consistent results.",
      criteria: [
        {
          title: "Technical Skills",
          weight: "30%",
          score: 94,
          note: "Ability to apply technical knowledge and skills",
          contribution: "28%",
        },
        {
          title: "Communication",
          weight: "20%",
          score: 90,
          note: "Written and verbal communication effectiveness",
          contribution: "18%",
        },
        {
          title: "Professionalism",
          weight: "20%",
          score: 93,
          note: "Work ethic and professional conduct",
          contribution: "19%",
        },
        {
          title: "Initiative",
          weight: "15%",
          score: 91,
          note: "Self-motivation and proactive approach",
          contribution: "14%",
        },
        {
          title: "Problem Solving",
          weight: "15%",
          score: 90,
          note: "Analytical thinking and solution development",
          contribution: "13%",
        },
      ],
    },
  ];

  const [pendingEvaluations, setPendingEvaluations] = useState(
    initialPendingEvaluations,
  );
  const [completedEvaluations, setCompletedEvaluations] = useState(
    initialCompletedEvaluations,
  );
  const [selectedRecord] = useState(initialPendingEvaluations[0]);
  const [selectedEvaluationRef, setSelectedEvaluationRef] = useState({
    id: initialPendingEvaluations[0].id,
    category: initialPendingEvaluations[0].category,
  });

  const allEvaluations = useMemo(() => {
    return [...pendingEvaluations, ...completedEvaluations];
  }, [pendingEvaluations, completedEvaluations]);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const activeEvaluation = useMemo(() => {
    return (
      allEvaluations.find(
        (item) =>
          item.id === selectedRecord?.id &&
          item.category === selectedRecord?.category,
      ) || null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allEvaluations, selectedEvaluationRef]);

  const handleSelectRecord = (item) => {
    setSelectedEvaluationRef({ id: item.id, category: item.category });
  };

  const handleFeedbackChange = (value) => {
    if (!activeEvaluation || activeEvaluation.category !== "pending") return;

    setPendingEvaluations((prev) =>
      prev.map((item) =>
        item.id === activeEvaluation.id ? { ...item, feedback: value } : item,
      ),
    );
  };

  const handleSaveReview = () => {
    if (!activeEvaluation || activeEvaluation.category !== "pending") return;
    alert(`Review saved for ${activeEvaluation.name}`);
  };

  const handleAuthorizeRequest = () => {
    if (!activeEvaluation || activeEvaluation.category !== "pending") return;

    const authorizedStudent = {
      ...activeEvaluation,
      category: "history",
      status: "Authorized",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    setCompletedEvaluations((prev) => [authorizedStudent, ...prev]);

    const remainingPending = pendingEvaluations.filter(
      (item) => item.id !== activeEvaluation.id,
    );
    setPendingEvaluations(remainingPending);

    setSelectedEvaluationRef({
      id: authorizedStudent.id,
      category: "history",
    });
  };

  const handleViewAuthorizedRecord = () => {
    if (!activeEvaluation || activeEvaluation.category !== "history") return;

    setSelectedEvaluationRef({
      id: activeEvaluation.id,
      category: activeEvaluation.category,
    });

    alert(`Viewing authorized record for ${activeEvaluation.name}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#FCFCFA] px-8 py-8 font-sans lg:px-10">
      <header className="mb-10">
        <h1 className="mb-3 text-4xl font-black tracking-tighter text-maroon-dark lg:text-5xl">
          Student <span className="text-gold">Evaluations</span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-text-secondary/80 lg:text-lg">
          Assess intern performance across key academic and professional
          competencies.
        </p>
      </header>

      <section className="mb-8">
        <div className="rounded-[12px] border border-border bg-[#FEFEFC] p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-gold/10 p-2 text-gold">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-maroon-dark">
                Pending Evaluations
              </h2>
              <p className="text-xs font-medium text-text-secondary">
                Students requiring your assessment
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingEvaluations.length > 0 ? (
              pendingEvaluations.map((item) => {
                const isActive =
                  activeEvaluation?.id === item.id &&
                  activeEvaluation?.category === item.category;

                return (
                  <button
                    key={`${item.category}-${item.id}`}
                    type="button"
                    onClick={() => handleSelectRecord(item)}
                    className={`group flex w-full items-center justify-between rounded-[20px] p-8 text-left transition-all ${
                      isActive
                        ? "border border-gold/30 bg-[#F7F6F2] shadow-sm"
                        : "bg-[#FBFBF8] hover:bg-[#F7F6F2]"
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FEFEFC] text-gold shadow-sm">
                        <Star size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black tracking-tight text-maroon-dark">
                          {item.name}{" "}
                          <span className="font-medium text-text-secondary">
                            &bull; {item.type}
                          </span>
                        </h3>
                        <p className="mt-1 text-md font-semibold text-text-secondary">
                          {item.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="rounded-full border border-gold/10 bg-gold/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gold">
                        {item.status}
                      </span>
                      <ChevronRight
                        className={`text-gold transition-transform ${
                          isActive
                            ? "translate-x-1"
                            : "group-hover:translate-x-1"
                        }`}
                      />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl bg-[#FBFBF8] p-8 text-center">
                <p className="text-sm font-semibold text-text-secondary">
                  No pending evaluations at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {activeEvaluation && (
        <section className="mb-8">
          <div className="rounded-[12px] border border-border bg-[#FEFEFC] p-10">
            <div className="mb-10 flex flex-col gap-6 border-b border-border/50 pb-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                  {activeEvaluation.category === "pending"
                    ? "Active Assessment"
                    : "Authorized Record"}
                </div>
                <h2 className="text-3xl font-black tracking-tight text-maroon-dark">
                  {activeEvaluation.type} &mdash; {activeEvaluation.name}
                </h2>
                <p className="mt-1 text-md font-medium text-text-secondary">
                  {activeEvaluation.program} &bull; {activeEvaluation.week}
                </p>
                <p className="mt-2 text-sm font-semibold text-text-secondary">
                  {activeEvaluation.company}
                </p>
                {activeEvaluation.category === "history" &&
                  activeEvaluation.date && (
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
                      Authorized on {activeEvaluation.date}
                    </p>
                  )}
              </div>

              <div
                className={`min-w-[220px] rounded-2xl p-6 text-center shadow-xl ${
                  activeEvaluation.category === "pending"
                    ? "bg-maroon-dark shadow-maroon-dark/10"
                    : "bg-emerald-700 shadow-emerald-700/10"
                }`}
              >
                <div className="mb-1 text-5xl font-black leading-none text-white">
                  {activeEvaluation.score}%
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  Final Score
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-8 text-2xl font-black tracking-tight text-maroon-dark">
                Performance Criteria
              </h3>

              <div className="grid grid-cols-1 gap-8">
                {activeEvaluation.criteria.map((item) => (
                  <div key={item.title}>
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="max-w-2xl">
                        <h4 className="text-lg font-bold text-maroon-dark">
                          {item.title}{" "}
                          <span className="text-sm font-medium text-text-secondary/60">
                            ({item.weight} Weight)
                          </span>
                        </h4>
                        <p className="mt-1 text-sm font-medium text-text-secondary">
                          {item.note}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-black text-maroon-dark">
                          {item.score}
                          <span className="text-sm opacity-30">/100</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gold">
                          Contrib: {item.contribution}
                        </p>
                      </div>
                    </div>

                    <div className="h-3 w-full overflow-hidden rounded-full border border-border/30 bg-[#FBFBF8]">
                      <div
                        className="h-full rounded-full bg-maroonCustom transition-all duration-1000"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-border/50 bg-[#FBFBF8] p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className="rounded-xl bg-[#FEFEFC] p-3 text-maroonCustom shadow-sm">
                  <MessageSquare size={24} />
                </div>

                <div className="flex-1">
                  <h3 className="mb-4 text-xl font-black tracking-tight text-maroon-dark">
                    Overall Feedback
                  </h3>

                  {activeEvaluation.category === "pending" ? (
                    <textarea
                      value={activeEvaluation.feedback}
                      onChange={(e) => handleFeedbackChange(e.target.value)}
                      className="min-h-[150px] w-full rounded-2xl border border-border/30 bg-[#FEFEFC] p-6 font-medium text-text-secondary outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                      placeholder="Provide qualitative feedback on the student's overall growth, technical agility, and professional conduct..."
                    />
                  ) : (
                    <div className="min-h-[150px] rounded-2xl border border-border/30 bg-[#FEFEFC] p-6 font-medium text-text-secondary">
                      {activeEvaluation.feedback || "No feedback was recorded."}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-4">
                {activeEvaluation.category === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSaveReview}
                      className="flex items-center gap-2 rounded-xl border border-[#7A1C1C] bg-gradient-to-r from-[#7A1C1C] to-[#8B2323] px-8 py-4 font-bold text-white shadow-lg shadow-[#7A1C1C]/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:from-[#6B1818] hover:to-[#7A1C1C]"
                    >
                      <Send size={20} className="text-white" />
                      Save Review
                    </button>

                    <button
                      type="button"
                      onClick={handleAuthorizeRequest}
                      className="flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-600 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={20} />
                      Authorize Request
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleViewAuthorizedRecord}
                    className="flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-600 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] hover:bg-emerald-700"
                  >
                    <FileText size={20} />
                    View Authorized Record
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="rounded-[12px] border border-border bg-[#FEFEFC] p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight text-maroon-dark">
              Evaluation History
            </h2>
            <p className="mt-1 text-md text-text-secondary">
              Archive of previously authorized assessments
            </p>
          </div>

          <div className="space-y-4">
            {completedEvaluations.map((item) => {
              const isActive =
                activeEvaluation?.id === item.id &&
                activeEvaluation?.category === item.category;

              return (
                <button
                  key={`${item.category}-${item.id}`}
                  type="button"
                  onClick={() => handleSelectRecord(item)}
                  className={`group flex w-full items-center justify-between rounded-2xl p-6 text-left transition-colors ${
                    isActive
                      ? "border border-emerald-200 bg-emerald-50"
                      : "bg-[#FBFBF8] hover:bg-[#F7F6F2]"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Award size={24} />
                    </div>

                    <div>
                      <h3 className="text-md font-bold text-maroon-dark">
                        {item.name} &bull;{" "}
                        <span className="font-medium">{item.type}</span>
                      </h3>
                      <p className="mt-0.5 text-xs font-medium text-text-secondary">
                        {item.company} &bull; Submitted on {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-2xl font-black leading-none text-emerald-600">
                        {item.score}%
                      </div>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-text-secondary/40">
                        Final Grade
                      </p>
                    </div>

                    <ChevronRight
                      size={24}
                      className={`transition-colors ${
                        isActive
                          ? "text-emerald-700"
                          : "text-text-secondary/40 group-hover:text-maroon-dark"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Evaluation;
