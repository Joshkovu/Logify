import MetricCard from "../../../../components/ui/MetricCard";
import { User, CheckCircle2, ChevronRight } from "lucide-react";

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
    status: "Pending",
  },
  {
    student: "Maria Garcia",
    org: "InnovateTech",
    role: "UI/UX Design Position",
    date: "Feb 22, 2026",
    status: "Pending",
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

const sectionCardClassName =
  "rounded-[12px] border border-border bg-white p-8 transition-all hover:scale-[1.01] dark:bg-slate-900 dark:border-slate-700";

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-8 py-8 font-sans text-[#1e1e1e] dark:bg-black dark:text-white md:px-12 md:py-10">
      <header className="mb-10">
        <h1 className="mb-3 text-4xl font-black tracking-tighter text-maroon-dark dark:text-white md:text-5xl">
          Academic <span className="text-gold">Dashboard</span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-text-secondary/80 dark:text-slate-300 md:text-lg">
          Welcome back, Dr. Roberts! Monitor student progress and manage
          academic approvals with real-time statistics.
        </p>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {summaryCards.map(({ title, value, iconType }) => (
          <MetricCard
            key={title}
            title={title}
            value={value}
            iconType={iconType}
          />
        ))}
      </section>

      <section className="mb-10">
        <div className={sectionCardClassName}>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-maroon-dark dark:text-white">
                Supervised Interns
              </h2>
              <p className="mt-1 text-sm text-text-secondary dark:text-slate-300 md:text-md">
                Students currently under your mentorship
              </p>
            </div>
            <div className="rounded-full bg-maroon/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-maroon dark:bg-gold/10 dark:text-gold md:text-sm">
              Active
            </div>
          </div>

          <div className="space-y-4">
            {supervisedInterns.map((intern) => (
              <div
                key={intern.name}
                className="rounded-2xl border border-border/30 bg-background/50 p-5 transition-transform hover:scale-[1.01] dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-maroonCustom/10 font-bold text-maroonCustom dark:bg-gold/10 dark:text-gold">
                      {intern.name.charAt(0)}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-maroon-dark dark:text-white md:text-lg">
                        {intern.name}
                      </h4>
                      <p className="text-xs font-medium text-text-secondary dark:text-slate-300">
                        {intern.company}
                      </p>
                      <p className="mt-1 text-xs text-text-secondary/80 dark:text-slate-400">
                        {intern.course}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-black uppercase tracking-widest text-gold">
                    {intern.week}
                  </span>
                </div>

                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                  <div
                    className="h-full bg-maroonCustom transition-all duration-1000 dark:bg-gold"
                    style={{ width: `${intern.progress}%` }}
                  />
                </div>

                <div className="text-right text-xs font-semibold text-text-secondary dark:text-slate-300">
                  {intern.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className={sectionCardClassName}>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-maroon-dark dark:text-white">
                Pending Approvals
              </h2>
              <p className="mt-1 text-sm text-text-secondary dark:text-slate-300 md:text-md">
                Review and authorize new internship site requests
              </p>
            </div>
            <div className="rounded-full bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold md:text-sm">
              Review
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/40 dark:border-slate-700">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-border/50 bg-background/70 dark:border-slate-700 dark:bg-slate-800">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60 dark:text-slate-300">
                    Student
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60 dark:text-slate-300">
                    Organization
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60 dark:text-slate-300">
                    Role
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60 dark:text-slate-300">
                    Submitted On
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60 dark:text-slate-300">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/30 dark:divide-slate-700">
                {approvals.map((approval) => (
                  <tr
                    key={approval.student}
                    className="transition-colors hover:bg-background/40 dark:hover:bg-slate-800"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 font-bold text-gold">
                          {approval.student.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-maroon-dark dark:text-white">
                          {approval.student}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-text-secondary dark:text-slate-300">
                      {approval.org}
                    </td>

                    <td className="px-6 py-5 text-sm text-text-secondary/90 dark:text-slate-300">
                      {approval.role}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-text-secondary dark:text-slate-300">
                      {approval.date}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        {approval.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <button className="inline-flex items-center gap-2 rounded-xl border border-gold/20 bg-white px-4 py-2 text-sm font-bold text-gold transition-all hover:bg-gold/5 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                        Review
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={sectionCardClassName}>
        <div className="mb-6">
          <h2 className="text-2xl font-black tracking-tight text-maroon-dark dark:text-white">
            Recent Supervision Activity
          </h2>
          <p className="mt-1 text-sm text-text-secondary dark:text-slate-300 md:text-md">
            Chronological log of your recent interactions and approvals
          </p>
        </div>

        <div className="space-y-4">
          {activities.map((activity, index) => {
            const isEvaluation = activity.type === "evaluation";

            return (
              <div
                key={`${activity.title}-${index}`}
                className="flex items-center gap-5 rounded-2xl border border-border/30 bg-background/50 p-5 transition-colors hover:bg-background dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    isEvaluation
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {isEvaluation ? (
                    <CheckCircle2 size={22} />
                  ) : (
                    <User size={22} />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-bold text-maroon-dark dark:text-white md:text-md">
                    {activity.title} &bull;{" "}
                    <span className="font-medium text-text-secondary dark:text-slate-300">
                      {activity.user}
                    </span>
                  </h3>
                  <p className="mt-0.5 text-sm text-text-secondary dark:text-slate-300">
                    {activity.desc}
                  </p>
                </div>

                <div className="text-xs font-bold uppercase tracking-tighter text-text-secondary/50 dark:text-slate-400 md:text-sm">
                  {activity.time}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
