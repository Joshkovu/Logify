import { Clock } from "lucide-react";
import MetricCard from "../../../../components/ui/MetricCard";

const metrics = [
  { title: "Total Interns", value: 427, iconType: "interns" },
  { title: "Active Placements", value: 15, iconType: "placements" },
  { title: "Pending Reviews", value: 23, iconType: "reviews" },
  { title: "Completed Evaluations", value: 300, iconType: "evaluations" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2"></div>
        <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
          Internship Admin <span className="text-gold">Dashboard</span>
        </h1>
        <p className="text-lg text-text-secondary/80 max-w-2xl leading-relaxed">
          Monitor and manage your internship programs with comprehensive data
          and real-time tracking.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {metrics.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            iconType={m.iconType}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-surface rounded-3xl shadow-sm p-10 border border-border/40 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                Score Distribution
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Final evaluation scores breakdown for current batch
              </p>
            </div>
            <div className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-bold rounded-full uppercase tracking-widest">
              Live
            </div>
          </div>
          <div className="h-48 bg-gray-50/50 rounded-2xl border border-dashed border-border/60 flex items-center justify-center text-text-secondary/40 text-sm font-medium italic">
            Chart Visualization Area
          </div>
        </div>
        <div className="bg-surface rounded-3xl shadow-sm p-10 border border-border/40 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                Placement Trends
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Monthly growth in internship applications
              </p>
            </div>
            <div className="px-3 py-1 bg-maroon/5 text-maroon text-[10px] font-bold rounded-full uppercase tracking-widest">
              Monthly
            </div>
          </div>
          <div className="h-48 bg-gray-50/50 rounded-2xl border border-dashed border-border/60 flex items-center justify-center text-text-secondary/40 text-sm font-medium italic">
            Trend Analysis Area
          </div>
        </div>
      </section>

      <section>
        <div className="w-full bg-surface rounded-3xl shadow-sm p-10 border border-border/40 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Recent System Activity
            </h2>
            <button className="text-xs font-bold text-gold hover:text-maroon transition-colors px-4 py-2 bg-gold/5 rounded-lg border border-gold/10">
              View All logs
            </button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-6 p-5 bg-background/50 rounded-2xl border border-border/30 hover:bg-background transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <Clock size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-maroon-dark">
                    New student registration processed
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Student ID #STR-2024-00{i} was successfully added to the
                    registry
                  </p>
                </div>
                <div className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-tighter">
                  {i * 2} mins ago
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
