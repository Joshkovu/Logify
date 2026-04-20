import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
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
  const [selectedEvaluationRef, setSelectedEvaluationRef] = useState({
    id: initialPendingEvaluations[0].id,
    category: initialPendingEvaluations[0].category,
  });
  const [isDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
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

  const allEvaluations = useMemo(() => {
    return [...pendingEvaluations, ...completedEvaluations];
  }, [pendingEvaluations, completedEvaluations]);

  const selectedEvaluation = useMemo(() => {
    return (
      allEvaluations.find(
        (item) =>
          item.id === selectedEvaluationRef.id &&
          item.category === selectedEvaluationRef.category,
      ) || null
    );
  }, [allEvaluations, selectedEvaluationRef]);

  const handleSelectRecord = (item) => {
    setSelectedEvaluationRef({ id: item.id, category: item.category });
  };

  const handleFeedbackChange = (value) => {
    if (!selectedEvaluation || selectedEvaluation.category !== "pending") {
      return;
    }

    setPendingEvaluations((prev) =>
      prev.map((item) =>
        item.id === selectedEvaluation.id ? { ...item, feedback: value } : item,
      ),
    );
  };

  const handleSaveReview = () => {
    if (!selectedEvaluation || selectedEvaluation.category !== "pending") {
      return;
    }
    alert(`Review saved for ${selectedEvaluation.name}`);
  };

  const handleAuthorizeRequest = () => {
    if (!selectedEvaluation || selectedEvaluation.category !== "pending") {
      return;
    }

    const authorizedStudent = {
      ...selectedEvaluation,
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
      (item) => item.id !== selectedEvaluation.id,
    );
    setPendingEvaluations(remainingPending);

    setSelectedEvaluationRef({
      id: authorizedStudent.id,
      category: "history",
    });
  };

  const handleViewAuthorizedRecord = () => {
    if (!selectedEvaluation || selectedEvaluation.category !== "history") {
      return;
    }

    setSelectedEvaluationRef({
      id: selectedEvaluation.id,
      category: selectedEvaluation.category,
    });

    alert(`Viewing authorized record for ${selectedEvaluation.name}`);
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
                const isActive =
                  selectedEvaluation?.id === item.id &&
                  selectedEvaluation?.category === item.category;

                return (
                  <button
                    key={`${item.category}-${item.id}`}
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
                  No pending evaluations at the moment.
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
                  {selectedEvaluation.type} &mdash; {selectedEvaluation.name}
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
                    key={item.title}
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
                        className="flex items-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-4 py-2 text-sm font-bold text-gold transition-colors hover:text-maroon dark:text-slate-300"
                      >
                        <Send size={18} />
                        Save Review
                      </button>

                      <button
                        type="button"
                        onClick={handleAuthorizeRequest}
                        className="flex items-center gap-2 rounded-lg border border-emerald-700 bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                      >
                        <CheckCircle2 size={18} />
                        Authorize Request
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
              const isActive =
                selectedEvaluation?.id === item.id &&
                selectedEvaluation?.category === item.category;

              return (
                <button
                  key={`${item.category}-${item.id}`}
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
                        Final Grade
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Evaluation;
