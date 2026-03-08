import MetricCard from "../../../../components/ui/MetricCard";

const Evaluations = () => {
  const metrics = [
    { title: "Current Average", value: "85%", iconType: "evaluations" },
    { title: "Evaluations", value: "1/2", iconType: "reviews" },
    { title: "Performance", value: "Good", iconType: "placements" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
          My <span className="text-gold">Evaluations</span>
        </h1>
        <p className="text-lg text-text-secondary/80 max-w-lg leading-relaxed">
          View your internship evaluations and performance scores across
          different criteria.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {metrics.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            iconType={m.iconType}
          />
        ))}
      </section>

      <div className="space-y-8">
        <section>
          <div className="bg-white rounded-2xl p-10 border border-border transition-transform">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                Evaluation History
              </h2>
              <p className="text-text-secondary text-md mt-1">
                All evaluations conducted during your internship
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-6 p-6 bg-background/50 rounded-2xl border border-border/30 hover:bg-background transition-colors">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-maroon-dark">
                    Mid-Term Evaluation
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Evaluator: Dr. Emily Roberts
                  </p>
                  <p className="text-xs text-text-secondary/60 mt-0.5">
                    Feb 15, 2026
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-gold">85%</div>
                  <div className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest mt-1">
                    Completed
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-background/50 rounded-2xl border border-border/30 hover:bg-background transition-colors">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-maroon-dark">
                    Final Evaluation
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Evaluator: Pending
                  </p>
                  <p className="text-xs text-text-secondary/60 mt-0.5">
                    Expected: Apr 12, 2026
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-text-secondary/40">
                    --
                  </div>
                  <div className="text-[10px] uppercase font-bold text-amber-600 tracking-widest mt-1">
                    In Progress
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <div className="bg-white rounded-2xl p-10 border border-border h-full">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                  Score Breakdown
                </h2>
                <p className="text-text-secondary text-md mt-1">
                  Detailed performance across key criteria
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { label: "Technical Skills", weight: "30%", score: 88 },
                  { label: "Communication", weight: "20%", score: 85 },
                  { label: "Professionalism", weight: "20%", score: 90 },
                  { label: "Initiative", weight: "15%", score: 82 },
                  { label: "Problem Solving", weight: "15%", score: 85 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-sm font-bold text-maroon-dark">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-text-secondary/60 ml-2 uppercase tracking-tighter">
                          ({item.weight} Weight)
                        </span>
                      </div>
                      <span className="text-sm font-black text-gold">
                        {item.score}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gold/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full transition-all duration-1000"
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-border mt-8 flex justify-between items-center">
                  <span className="text-lg font-black text-maroon-dark">
                    Overall Performance
                  </span>
                  <span className="text-3xl font-black text-gold">85%</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white rounded-2xl p-10 border border-border h-full">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                  Supervisor Feedback
                </h2>
                <p className="text-text-secondary text-md mt-1">
                  Comments from your academic supervisor
                </p>
              </div>

              <div className="p-8 bg-background/50 rounded-2xl border border-border/30 italic text-text-secondary leading-relaxed relative">
                <span className="absolute top-4 left-4 text-4xl text-gold/20 font-serif">
                  &quot;
                </span>
                Sarah has shown exceptional growth in her technical
                capabilities. Her ability to synthesize complex requirements
                into working prototypes is impressive. She should continue
                focusing on documentation standards in the final phase of her
                internship.
                <div className="mt-8 not-italic flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-maroonCustom flex items-center justify-center text-white font-bold text-xs">
                    ER
                  </div>
                  <div>
                    <p className="text-sm font-bold text-maroon-dark">
                      Dr. Emily Roberts
                    </p>
                    <p className="text-[10px] uppercase font-bold text-text-secondary/60 tracking-widest">
                      Academic Supervisor
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Evaluations;
