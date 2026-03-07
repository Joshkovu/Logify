import MetricCard from "../../../../components/ui/MetricCard";
import { User, Clock, CheckCircle2, ChevronRight } from "lucide-react";

const Dashboard = () => {
  const summaryCards = [
    {
      title: "Interns Supervised",
      value: "5",
      iconType: "interns",
    },
    {
      title: "Pending Approvals",
      value: "2",
      iconType: "placements",
    },
    {
      title: "Pending Evaluations",
      value: "1",
      iconType: "evaluations",
    },
  ];

  const supervisedInterns = [
    {
      name: "Sarah Johnson",
      company: "TechCorp Solutions Inc.",
      course: "Software Engineering",
      progress: 65,
      week: "Week 8/12",
    },
    {
      name: "Robert Kim",
      company: "DataTech Analytics",
      course: "Computer Science",
      progress: 80,
      week: "Week 10/12",
    },
    {
      name: "Lisa Wang",
      company: "CloudNet Systems",
      course: "Information Technology",
      progress: 45,
      week: "Week 6/12",
    },
  ];

  const approvals = [
    {
      student: "David Chen",
      org: "FinTech Corp",
      role: "Software Development Position",
      date: "Feb 23, 2026",
    },
    {
      student: "Maria Garcia",
      org: "InnovateTech",
      role: "UI/UX Design Position",
      date: "Feb 22, 2026",
    },
  ];

  const activities = [
    {
      title: "Completed Mid-Term Evaluation",
      user: "Sarah Johnson",
      desc: "Score: 85% - Excellent performance",
      time: "3 days ago",
      type: "evaluation",
    },
    {
      title: "Approved Placement",
      user: "Robert Kim",
      desc: "DataTech Analytics - Data Science Position",
      time: "5 days ago",
      type: "placement",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 px-12 py-10 font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
          Academic <span className="text-gold">Dashboard</span>
        </h1>
        <p className="text-lg text-text-secondary/80 max-w-2xl leading-relaxed">
          Welcome back, Dr. Roberts! Monitor student progress and manage
          academic approvals with real-time statistics.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {summaryCards.map((card) => (
          <MetricCard
            key={card.title}
            title={card.title}
            value={card.value}
            iconType={card.iconType}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-[12px] p-10 border border-border">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                Supervised Interns
              </h2>
              <p className="text-text-secondary text-md mt-1">
                Students currently under your mentorship
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {supervisedInterns.map((intern) => (
              <div
                key={intern.name}
                className="p-6 bg-background/50 rounded-2xl border border-border/30 hover:scale-101 transition-transform"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-maroonCustom/10 text-maroonCustom flex items-center justify-center font-bold">
                      {intern.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-maroon-dark">
                        {intern.name}
                      </h4>
                      <p className="text-xs text-text-secondary font-medium">
                        {intern.company}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-gold uppercase tracking-widest">
                    {intern.week}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-maroonCustom transition-all duration-1000"
                    style={{ width: `${intern.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[12px] p-10 border border-border">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                Pending Approvals
              </h2>
              <p className="text-text-secondary text-md mt-1">
                Review and authorize new internship site requests
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {approvals.map((approval) => (
              <div
                key={approval.student}
                className="p-6 border border-gold/20 bg-gold/5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-gold/10 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-white rounded-xl text-gold shadow-sm">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-maroon-dark">
                      {approval.student} &bull;{" "}
                      <span className="text-sm font-medium text-text-secondary">
                        {approval.org}
                      </span>
                    </h4>
                    <p className="text-xs text-text-secondary mt-1 font-medium italic">
                      {approval.role}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-gold group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[12px] p-10 border border-border">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
            Recent Supervision Activity
          </h2>
          <p className="text-text-secondary text-md mt-1">
            Chronological log of your recent interactions and approvals
          </p>
        </div>

        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-6 p-5 bg-background/50 rounded-2xl border border-border/30 hover:bg-background transition-colors"
            >
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  activity.type === "evaluation"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {activity.type === "evaluation" ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-md font-bold text-maroon-dark">
                  {activity.title} &bull;{" "}
                  <span className="text-text-secondary font-medium">
                    {activity.user}
                  </span>
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
      </section>
    </div>
  );
};

export default Dashboard;
