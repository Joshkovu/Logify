import ThemeToggle from "@/components/ui/ThemeToggle";
import MetricCard from "../../../../components/ui/MetricCard";
import { User, CheckCircle2, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const summaryCards = [
  { title: "Interns Supervised", value: "5", iconType: "interns" },
  { title: "Pending Approvals", value: "2", iconType: "placements" },
  { title: "Pending Evaluations", value: "1", iconType: "evaluations" },
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
  "rounded-[12px] border border-border bg-card text-card-foreground p-4 transition-all hover:scale-[1.005] sm:p-6 lg:p-8 xl:p-10";

const Dashboard = () => {
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

  const handleReviewApproval = (approval) => {
    alert(`Reviewing approval for ${approval.student}`);
  };

  return (
    <div className="min-h-screen w-full bg-background px-4 py-6 font-sans text-foreground transition-colors duration-300 sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
      <div className="mb-5 -mx-4 flex items-center justify-between border-b border-border px-4 pb-1.5 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 xl:-mx-12 xl:px-12">
        <h1 className="text-sm font-bold uppercase tracking-[0.18em] text-black/70 dark:text-slate-300 sm:text-base">
          LOGIFY ACADEMIC SUPERVISOR
        </h1>

        <ThemeToggle />
      </div>

      <header className="mb-8 sm:mb-10 lg:mb-12">
        <h1 className="mb-3 text-3xl font-black tracking-tighter text-maroon-dark dark:text-white sm:text-4xl lg:text-5xl">
          Academic <span className="text-gold">Dashboard</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
          Welcome back, Dr. Roberts! Monitor student progress and manage
          academic approvals with real-time statistics.
        </p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-8">
        {summaryCards.map(({ title, value, iconType }) => (
          <MetricCard
            key={title}
            title={title}
            value={value}
            iconType={iconType}
          />
        ))}
      </section>

      <section className="mb-8">
        <div className={sectionCardClassName}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
                Supervised Interns
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Students currently under your mentorship
              </p>
            </div>

            <div className="w-fit rounded-full bg-maroon/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-maroon dark:text-slate-300 sm:text-sm">
              Active
            </div>
          </div>

          <div className="space-y-4">
            {supervisedInterns.map((intern) => (
              <div
                key={intern.name}
                className="rounded-2xl border border-border bg-muted p-4 transition-all hover:scale-[1.005] sm:p-5"
              >
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroonCustom/10 font-bold text-maroonCustom dark:text-slate-300">
                      {intern.name.charAt(0)}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-maroon-dark dark:text-white sm:text-base lg:text-lg">
                        {intern.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {intern.company}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/80">
                        {intern.course}
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gold dark:text-slate-300">
                    {intern.week}
                  </span>
                </div>

                <div className="mb-2 h-3 w-full overflow-hidden rounded-full border border-border/30 bg-background">
                  <div
                    className="h-full rounded-full bg-maroonCustom transition-all duration-1000 dark:bg-gold"
                    style={{ width: `${intern.progress}%` }}
                  />
                </div>

                <div className="text-right text-xs font-semibold text-muted-foreground">
                  {intern.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className={sectionCardClassName}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
                Pending Approvals
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Review and authorize new internship site requests
              </p>
            </div>

            <div className="w-fit rounded-full bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gold dark:text-slate-300 sm:text-sm">
              Review
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-border/50 bg-muted/70">
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Student
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Organization
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Role
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Submitted On
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Status
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-maroon-dark/60 dark:text-slate-300 sm:px-6">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/30">
                {approvals.map((approval) => (
                  <tr
                    key={approval.student}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-5 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 font-bold text-gold dark:text-slate-300">
                          {approval.student.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-maroon-dark dark:text-white">
                          {approval.student}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-5 text-sm text-muted-foreground sm:px-6">
                      {approval.org}
                    </td>

                    <td className="px-4 py-5 text-sm text-muted-foreground sm:px-6">
                      {approval.role}
                    </td>

                    <td className="px-4 py-5 text-sm text-muted-foreground sm:px-6">
                      {approval.date}
                    </td>

                    <td className="px-4 py-5 sm:px-6">
                      <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        {approval.status}
                      </span>
                    </td>

                    <td className="px-4 py-5 sm:px-6">
                      <button
                        onClick={() => handleReviewApproval(approval)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-4 py-2 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon active:scale-[0.98] dark:text-slate-300"
                      >
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
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
            Recent Supervision Activity
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Chronological log of your recent interactions and approvals
          </p>
        </div>

        <div className="space-y-4">
          {activities.map((activity, index) => {
            const isEvaluation = activity.type === "evaluation";

            return (
              <div
                key={`${activity.title}-${index}`}
                className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-muted p-4 transition-colors hover:bg-background sm:flex-row sm:items-center sm:gap-5 sm:p-5"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
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
                  <h3 className="text-sm font-bold text-maroon-dark dark:text-slate-300 sm:text-base">
                    {activity.title} &bull;{" "}
                    <span className="font-medium text-muted-foreground">
                      {activity.user}
                    </span>
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {activity.desc}
                  </p>
                </div>

                <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground/60 sm:text-sm">
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
