import { Clock } from "lucide-react";
import MetricCard from "../../../../components/ui/MetricCard";

const Dashboard = () => {
  const person = {
    firstName: "Sarah",
    lastName: "Johnson",
  };

  const metrics = [
    { title: "Status", value: "Active", iconType: "placements" },
    { title: "Weekly Logs", value: "8/12", iconType: "reviews" },
    { title: "Pending Tasks", value: "3", iconType: "reviews" },
    { title: "Final Score", value: "Pending", iconType: "evaluations" },
  ];

  return (
    <div className="dark:bg-slate-950 min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
          Student Dashboard
        </h1>
        <p className="text-lg max-w-lg text-text-secondary/80 leading-relaxed">
          Welcome back, {person.firstName}! Here&apos;s your internship
          overview.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {metrics.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            iconType={m.iconType}
          />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <section>
          <div className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border transition-all h-full">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                Current Internship
              </h2>
              <p className="text-text-secondary text-md mt-1">
                Your active placement details
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  Organization
                </p>
                <p className="text-lg font-bold text-maroon-dark mb-4">
                  TechCorp Solutions Inc.
                </p>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  Workplace Supervisor
                </p>
                <p className="text-lg font-bold text-maroon-dark mb-4">
                  Michael Chen
                </p>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  Start Date
                </p>
                <p className="text-lg font-bold text-maroon-dark">
                  Jan 15, 2026
                </p>
              </div>
              <div>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  Position
                </p>
                <p className="text-lg font-bold text-maroon-dark mb-4">
                  Software Engineering Intern
                </p>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  Academic Supervisor
                </p>
                <p className="text-lg font-bold text-maroon-dark mb-4">
                  Dr. Emily Roberts
                </p>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  End Date
                </p>
                <p className="text-lg font-bold text-maroon-dark">
                  Apr 10, 2026
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border transition-transform h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                  Recent Activity
                </h2>
                <p className="text-text-secondary text-md mt-1">
                  Your latest updates and actions
                </p>
              </div>
              <button className="dark:bg-slate-900 dark:hover:bg-slate-700 -mt-6 text-xs text-white font-bold hover:bg-red-800 transition-colors px-4 py-3 bg-maroonCustom rounded-lg border">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Week 8 Log Approved",
                  desc: "Your weekly log has been reviewed and approved by Michael Chen",
                  time: "2 days ago",
                },
                {
                  title: "Week 8 Log Submitted",
                  desc: "Successfully submitted your weekly log for review",
                  time: "4 days ago",
                },
                {
                  title: "Week 7 Log Approved",
                  desc: "Your weekly log has been reviewed and approved",
                  time: "1 week ago",
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 p-5 bg-background/50 rounded-[12px] border border-border/30 hover:bg-background transition-colors"
                >
                  <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                    <Clock size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-md font-bold text-maroon-dark">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {activity.desc}
                    </p>
                  </div>
                  <div className="text-md font-bold text-text-secondary/50 uppercase tracking-tighter">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
