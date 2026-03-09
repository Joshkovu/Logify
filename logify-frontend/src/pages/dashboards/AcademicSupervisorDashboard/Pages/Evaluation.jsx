import {
  Clock,
  Star,
  Award,
  MessageSquare,
  ChevronRight,
  Send,
} from "lucide-react";

const Evaluation = () => {
  const pendingEvaluation = {
    name: "Sarah Johnson",
    type: "Mid-Term Evaluation",
    company: "TechCorp Solutions Inc.",
    status: "In Progress",
    program: "Software Engineering",
    week: "Week 8 of 12",
    score: 86,
  };

  const criteria = [
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
  ];

  const completedEvaluations = [
    {
      name: "Robert Kim",
      type: "Mid-Term Evaluation",
      company: "DataTech Analytics",
      date: "Feb 18, 2026",
      score: "88",
    },
    {
      name: "Lisa Wang",
      type: "Mid-Term Evaluation",
      company: "CloudNet Systems",
      date: "Feb 12, 2026",
      score: "92",
    },
  ];

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

          <div className="group flex cursor-pointer items-center justify-between rounded-[20px] bg-[#FBFBF8] p-8 transition-colors hover:bg-[#F7F6F2]">
            <div className="flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FEFEFC] text-gold shadow-sm">
                <Star size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-maroon-dark">
                  {pendingEvaluation.name} &bull;{" "}
                  <span className="font-medium text-text-secondary">
                    {pendingEvaluation.type}
                  </span>
                </h3>
                <p className="mt-1 text-md font-semibold text-text-secondary">
                  {pendingEvaluation.company}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="rounded-full border border-gold/10 bg-gold/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gold">
                {pendingEvaluation.status}
              </span>
              <ChevronRight className="text-gold transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="rounded-[12px] border border-border bg-[#FEFEFC] p-10">
          <div className="mb-10 flex flex-col gap-6 border-b border-border/50 pb-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                Active Assessment
              </div>
              <h2 className="text-3xl font-black tracking-tight text-maroon-dark">
                {pendingEvaluation.type} &mdash; {pendingEvaluation.name}
              </h2>
              <p className="mt-1 text-md font-medium text-text-secondary">
                {pendingEvaluation.program} &bull; {pendingEvaluation.week}
              </p>
            </div>

            <div className="min-w-[220px] rounded-2xl bg-maroon-dark p-6 text-center shadow-xl shadow-maroon-dark/10">
              <div className="mb-1 text-5xl font-black leading-none text-gold">
                {pendingEvaluation.score}%
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold/40">
                Calculated Score
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-8 text-2xl font-black tracking-tight text-maroon-dark">
              Performance Criteria
            </h3>

            <div className="grid grid-cols-1 gap-8">
              {criteria.map((item) => (
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
                <textarea
                  className="min-h-[150px] w-full rounded-2xl border border-border/30 bg-[#FEFEFC] p-6 font-medium text-text-secondary outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                  placeholder="Provide qualitative feedback on the student's overall growth, technical agility, and professional conduct..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="flex items-center gap-2 rounded-xl border border-[#7A1C1C] bg-gradient-to-r from-[#7A1C1C] to-[#8B2323] px-8 py-4 font-bold text-white shadow-lg shadow-[#7A1C1C]/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:from-[#6B1818] hover:to-[#7A1C1C]">
                <Send size={20} className="text-white" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>

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
            {completedEvaluations.map((item) => (
              <div
                key={item.name}
                className="group flex items-center justify-between rounded-2xl bg-[#FBFBF8] p-6 transition-colors hover:bg-[#F7F6F2]"
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

                  <button className="p-2 text-text-secondary/40 transition-colors hover:text-maroon-dark">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Evaluation;
