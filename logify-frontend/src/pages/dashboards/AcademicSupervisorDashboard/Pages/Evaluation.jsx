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
    <div className="min-h-screen w-full bg-gray-50 px-12 py-10 font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
          Student <span className="text-gold">Evaluations</span>
        </h1>
        <p className="text-lg text-text-secondary/80 max-w-2xl leading-relaxed">
          Assess intern performance across key academic and professional
          competencies.
        </p>
      </header>

      <section className="mb-12">
        <div className="bg-white rounded-[12px] p-10 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gold/10 rounded-lg text-gold">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                Pending Evaluations
              </h2>
              <p className="text-xs text-text-secondary font-medium">
                Students requiring your assessment
              </p>
            </div>
          </div>

          <div className="p-8 bg-gold/5 border border-gold/20 rounded-[20px] flex items-center justify-between group cursor-pointer hover:bg-gold/10 transition-colors">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gold">
                <Star size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-maroon-dark tracking-tight">
                  {pendingEvaluation.name} &bull;{" "}
                  <span className="text-text-secondary font-medium">
                    {pendingEvaluation.type}
                  </span>
                </h3>
                <p className="text-md text-text-secondary mt-1 font-semibold">
                  {pendingEvaluation.company}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 rounded-full bg-white border border-gold/20 text-[10px] font-black uppercase tracking-widest text-gold shadow-sm">
                {pendingEvaluation.status}
              </span>
              <ChevronRight className="text-gold group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-white rounded-[12px] p-10 border border-border">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 pb-8 border-b border-border/50">
            <div>
              <div className="text-[10px] uppercase font-bold text-gold tracking-[0.2em] mb-2">
                Active Assessment
              </div>
              <h2 className="text-3xl font-black text-maroon-dark tracking-tight">
                {pendingEvaluation.type} &mdash; {pendingEvaluation.name}
              </h2>
              <p className="text-text-secondary text-md mt-1 font-medium">
                {pendingEvaluation.program} &bull; {pendingEvaluation.week}
              </p>
            </div>

            <div className="bg-maroon-dark rounded-2xl p-6 text-center min-w-[200px] shadow-xl shadow-maroon-dark/10">
              <div className="text-5xl font-black text-gold leading-none mb-1">
                {pendingEvaluation.score}%
              </div>
              <p className="text-[10px] uppercase font-bold text-gold/40 tracking-widest">
                Calculated Score
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-black text-maroon-dark tracking-tight mb-8">
              Performance Criteria
            </h3>
            <div className="grid grid-cols-1 gap-10">
              {criteria.map((item) => (
                <div key={item.title}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="max-w-2xl">
                      <h4 className="text-lg font-bold text-maroon-dark">
                        {item.title}{" "}
                        <span className="text-sm font-medium text-text-secondary/60">
                          ({item.weight} Weight)
                        </span>
                      </h4>
                      <p className="text-sm text-text-secondary font-medium mt-1">
                        {item.note}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-maroon-dark">
                        {item.score}
                        <span className="text-sm opacity-30">/100</span>
                      </div>
                      <p className="text-[10px] font-bold text-gold uppercase tracking-widest">
                        Contrib: {item.contribution}
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-border/30">
                    <div
                      className="h-full bg-maroonCustom rounded-full transition-all duration-1000"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 bg-background rounded-[24px] border border-border/50 mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-white rounded-xl text-maroonCustom shadow-sm">
                <MessageSquare size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-maroon-dark tracking-tight mb-4">
                  Overall Feedback
                </h3>
                <textarea
                  className="w-full min-h-[150px] bg-white border border-border rounded-2xl p-6 text-text-secondary font-medium focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  placeholder="Provide qualitative feedback on the student's overall growth, technical agility, and professional conduct..."
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-8 py-4 bg-maroon-dark text-white rounded-xl font-bold shadow-lg shadow-maroon-dark/20 hover:scale-[1.02] transition-transform">
                <Send size={20} className="text-gold" />
                Submit Final Evaluation
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-white rounded-[12px] p-10 border border-border">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Evaluation History
            </h2>
            <p className="text-text-secondary text-md mt-1">
              Archive of previously authorized assessments
            </p>
          </div>

          <div className="space-y-4">
            {completedEvaluations.map((item) => (
              <div
                key={item.name}
                className="p-6 bg-background/50 border border-border/30 rounded-2xl flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-maroon-dark">
                      {item.name} &bull;{" "}
                      <span className="font-medium">{item.type}</span>
                    </h3>
                    <p className="text-xs text-text-secondary font-medium mt-0.5">
                      {item.company} &bull; Submitted on {item.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-600 leading-none">
                      {item.score}%
                    </div>
                    <p className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest mt-1">
                      Final Grade
                    </p>
                  </div>
                  <button className="p-2 text-text-secondary/40 hover:text-maroon transition-colors">
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
