import MetricCard from "../../../components/ui/MetricCard";

const metrics = [
  { title: "Total Interns", value: 427, iconType: "interns" },
  { title: "Active Placements", value: 15, iconType: "placements" },
  { title: "Pending Reviews", value: 23, iconType: "reviews" },
  { title: "Completed Evaluations", value: 300, iconType: "evaluations" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-background px-10 py-8 ml-64 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-maroon mb-2 tracking-tight">
          Internship Admin Dashboard
        </h1>
        <p className="text-lg text-text-secondary">
          Complete overview of the internship management system
        </p>
      </header>

      <section className="grid grid-cols-4 gap-6 mb-10">
        {metrics.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            iconType={m.iconType}
          />
        ))}
      </section>

      <section className="flex gap-6 mb-10">
        <div className="flex-1 bg-surface rounded-xl shadow-md p-8 border border-border">
          <h2 className="text-xl font-bold text-maroon mb-2">
            Score Distribution
          </h2>
          <p className="text-text-secondary">
            Final evaluation scores breakdown
          </p>
        </div>
        <div className="flex-1 bg-surface rounded-xl shadow-md p-8 border border-border">
          <h2 className="text-xl font-bold text-maroon mb-2">
            Internship Completion Trend
          </h2>
          <p className="text-text-secondary">Monthly completion statistics</p>
        </div>
      </section>

      <section className="mb-10">
        <div className="w-full bg-surface rounded-xl shadow-md p-8 border border-border">
          <h2 className="text-xl font-bold text-maroon mb-2">
            Internship Status Overview
          </h2>
          <p className="text-text-secondary">
            Current status of all internships
          </p>
        </div>
      </section>

      <section>
        <div className="w-full bg-surface rounded-xl shadow-md p-8 border border-border">
          <h2 className="text-xl font-bold text-maroon mb-2">
            Recent System Activity
          </h2>
          <p className="text-text-secondary mb-4">
            Latest updates and changes in the system
          </p>
          <div className="flex gap-6">
            <div className="flex-1">
              {/* Placeholder for activity feed pointer */}
            </div>
            <div className="flex-1">
              <div className="bg-background rounded-lg p-4 border border-border">
                <h3 className="text-base font-semibold text-maroon mb-1">
                  New student registered
                </h3>
                <p className="text-text-secondary">
                  John Doe registered on 2024-01-15
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
