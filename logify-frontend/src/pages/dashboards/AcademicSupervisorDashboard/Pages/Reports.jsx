import MetricCard from "../../../../components/ui/MetricCard";
import { BarChart3, PieChart, FileDown, TrendingUp } from "lucide-react";

const Reports = () => {
  const stats = [
    {
      title: "Total Interns",
      value: "15",
      iconType: "interns",
    },
    {
      title: "Average Score",
      value: "86.6%",
      iconType: "reviews",
    },
    {
      title: "Completion Rate",
      value: "95%",
      iconType: "evaluations",
    },
    {
      title: "Active Placements",
      value: "5",
      iconType: "placements",
    },
  ];

  const students = [
    {
      name: "Sarah Johnson",
      organization: "TechCorp Solutions",
      progress: "Week 8/12",
      status: "Active",
      score: 85,
    },
    {
      name: "Robert Kim",
      organization: "DataTech Analytics",
      progress: "Week 10/12",
      status: "Active",
      score: 88,
    },
    {
      name: "Lisa Wang",
      organization: "CloudNet Systems",
      progress: "Week 6/12",
      status: "Active",
      score: 92,
    },
    {
      name: "David Chen",
      organization: "FinTech Corp",
      progress: "Not Started",
      status: "Pending",
      score: 0,
    },
    {
      name: "Maria Garcia",
      organization: "InnovateTech",
      progress: "Not Started",
      status: "Pending",
      score: 0,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 px-12 py-10 font-sans">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
            Reports & <span className="text-gold">Analytics</span>
          </h1>
          <p className="text-lg text-text-secondary/80 max-w-2xl leading-relaxed">
            Gain deep insights into intern performance, placement trends, and
            academic milestones.
          </p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-maroon-dark text-white rounded-xl font-bold shadow-lg shadow-maroon-dark/20 hover:scale-[1.02] transition-transform">
          <FileDown size={20} className="text-gold" />
          Export Semester Report
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            iconType={stat.iconType}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white rounded-[12px] p-10 border border-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-maroonCustom/10 rounded-lg text-maroonCustom">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Performance Overview
            </h2>
          </div>
          <div className="h-64 bg-background/50 rounded-3xl border border-dashed border-border/50 flex flex-col items-center justify-center text-text-secondary/40">
            <BarChart3 size={48} className="mb-4 opacity-20" />
            <p className="text-xs font-black uppercase tracking-widest">
              Aggregate Scores Distribution
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[12px] p-10 border border-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gold/10 rounded-lg text-gold">
              <PieChart size={20} />
            </div>
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Status Distribution
            </h2>
          </div>
          <div className="h-64 bg-background/50 rounded-3xl border border-dashed border-border/50 flex flex-col items-center justify-center text-text-secondary/40">
            <PieChart size={48} className="mb-4 opacity-20" />
            <p className="text-xs font-black uppercase tracking-widest">
              Active vs Pending Placements
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[12px] p-10 border border-border">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Detailed Performance Breakdown
            </h2>
            <p className="text-text-secondary text-md mt-1 font-medium italic opacity-60">
              Full list of supervised interns and their current academic
              standing
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/50">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background/80 border-b border-border/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60">
                  Student
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60">
                  Organization
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60">
                  Progress
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60">
                  Score
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {students.map((student) => (
                <tr
                  key={student.name}
                  className="hover:bg-background/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-maroonCustom/5 text-maroonCustom flex items-center justify-center font-bold text-sm">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-md font-bold text-maroon-dark">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-text-secondary">
                    {student.organization}
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gold tracking-tight">
                    {student.progress}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-md font-black ${student.score >= 90 ? "text-emerald-600" : "text-maroon-dark"}`}
                      >
                        {student.score > 0 ? `${student.score}%` : "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                        student.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100"
                          : "bg-gold/5 text-gold border-gold/10 group-hover:bg-gold/10"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Reports;
