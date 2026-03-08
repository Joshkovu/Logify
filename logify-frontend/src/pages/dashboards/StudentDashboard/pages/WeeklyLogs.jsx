import { useState } from "react";
import CreateWeeklyLog from "../CreateWeeklyLog";
import { Eye, FilePlus } from "lucide-react";
import MetricCard from "../../../../components/ui/MetricCard";

const WeeklyLogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const metrics = [
    { title: "Total Logs", value: "8", iconType: "reviews" },
    { title: "Approved", value: "8", iconType: "evaluations" },
    { title: "Approval Rate", value: "100%", iconType: "placements" },
  ];

  const logs = [
    {
      week: "Week 8",
      range: "Feb 17 - Feb 23",
      status: "Approved",
      date: "Feb 23, 2026",
    },
    {
      week: "Week 7",
      range: "Feb 10 - Feb 16",
      status: "Approved",
      date: "Feb 16, 2026",
    },
    {
      week: "Week 6",
      range: "Feb 3 - Feb 9",
      status: "Approved",
      date: "Feb 9, 2026",
    },
    {
      week: "Week 5",
      range: "Jan 27 - Feb 2",
      status: "Approved",
      date: "Feb 2, 2026",
    },
    {
      week: "Week 4",
      range: "Jan 20 - Jan 26",
      status: "Approved",
      date: "Jan 26, 2026",
    },
    {
      week: "Week 3",
      range: "Jan 13 - Jan 19",
      status: "Approved",
      date: "Jan 19, 2026",
    },
    {
      week: "Week 2",
      range: "Jan 6 - Jan 12",
      status: "Approved",
      date: "Jan 12, 2026",
    },
    {
      week: "Week 1",
      range: "Dec 30 - Jan 5",
      status: "Approved",
      date: "Jan 5, 2026",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans">
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
            Weekly Logs
          </h1>
          <p className="text-lg text-text-secondary/80 max-w-lg leading-relaxed">
            Track your internship progress, document daily activities, and
            monitor supervisor approvals.
          </p>
        </div>
        <div className="ml-auto mt-2.5">
          <button
            className="flex items-center gap-2 text-sm font-bold text-white px-6 py-3 bg-maroonCustom hover:bg-red-800 transition-all rounded-xl shadow-lg shadow-maroonCustom/20"
            onClick={() => setIsModalOpen(true)}
          >
            <FilePlus size={18} />
            New Log
          </button>
          <CreateWeeklyLog
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
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

      <section>
        <div className="bg-white rounded-[12px] p-10 border border-border">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Log History
            </h2>
            <p className="text-text-secondary text-md mt-1">
              Complete archive of your submitted professional journals
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-black text-text-secondary/40">
                    Week
                  </th>
                  <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-black text-text-secondary/40">
                    Date Range
                  </th>
                  <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-black text-text-secondary/40">
                    Status
                  </th>
                  <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-black text-text-secondary/40">
                    Submitted
                  </th>
                  <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-black text-text-secondary/40 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {logs.map((log, i) => (
                  <tr
                    key={i}
                    className="hover:bg-background/50 transition-colors group"
                  >
                    <td className="py-5 px-4">
                      <span className="font-bold text-maroon-dark">
                        {log.week}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-sm text-text-secondary font-medium">
                      {log.range}
                    </td>
                    <td className="py-5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-sm text-text-secondary/60 font-medium">
                      {log.date}
                    </td>
                    <td className="py-5 px-4 text-right">
                      <button className="inline-flex items-center gap-2 text-xs font-bold text-gold hover:text-maroon transition-colors px-3 py-1.5 bg-gold/5 rounded-lg border border-gold/10">
                        <Eye size={14} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeeklyLogs;
