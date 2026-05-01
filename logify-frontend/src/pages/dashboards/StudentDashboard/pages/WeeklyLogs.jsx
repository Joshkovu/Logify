import { useState, useEffect, useCallback } from "react";
import { api } from "../../../../config/api";
import CreateWeeklyLog from "../CreateWeeklyLog";
import { Eye, FilePlus } from "lucide-react";
import MetricCard from "../../../../components/ui/MetricCard";

const WeeklyLogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [placementData, setPlacementData] = useState(null);
  const [weeklyLogList, setWeeklyLogList] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [isLoadingPlacement, setIsLoadingPlacement] = useState(true);
  const fetchWeeklyLogs = useCallback(async () => {
    try {
      setIsLoadingLogs(true);
      const data = await api.logbook.getWeeklyLogHistory();
      setWeeklyLogList(data.weekly_logs ?? []);
    } catch {
      setWeeklyLogList([]);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    const fetchPlacementData = async () => {
      try {
        setIsLoadingPlacement(true);
        const data = await api.placements.getPlacements();
        setPlacementData(data[0]);
      } catch {
        setPlacementData(null);
      } finally {
        setIsLoadingPlacement(false);
      }
    };
    fetchPlacementData();
  }, []);

  useEffect(() => {
    fetchWeeklyLogs();
  }, [fetchWeeklyLogs]);

  const approvedList =
    weeklyLogList?.filter((log) => log.status.toLowerCase() === "approved") ??
    [];
  const approvalRate =
    weeklyLogList?.length > 0
      ? Math.round((approvedList.length / weeklyLogList.length) * 100)
      : 0;
  const metrics = [
    {
      title: "Total Logs",
      value: isLoadingLogs
        ? "Loading..."
        : (weeklyLogList?.length ?? 0).toString(),
      iconType: "reviews",
    },
    {
      title: "Approved",
      value: isLoadingLogs
        ? "Loading..."
        : (approvedList?.length ?? 0).toString(),
      iconType: "evaluations",
    },
    {
      title: "Approval Rate",
      value: isLoadingLogs
        ? "Loading..."
        : weeklyLogList?.length > 0
          ? `${approvalRate}%`
          : "0%",
      iconType: "placements",
    },
  ];

  return (
    <div className="dark:bg-slate-950 min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans">
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
            className="disabled:bg-maroonCustom/60 flex items-center gap-2 text-sm font-bold text-white px-6 py-3 bg-maroonCustom hover:bg-red-800 transition-all rounded-xl"
            onClick={() => setIsModalOpen(true)}
            disabled={placementData?.status.toLowerCase() !== "active"}
          >
            <FilePlus size={18} />
            {isLoadingPlacement
              ? "Loading..."
              : (!placementData && "Placement not found") ||
                (placementData?.status.toLowerCase() == "active" &&
                  "New Log") ||
                (placementData?.status.toLowerCase() !== "active" &&
                  "Placement not active")}
          </button>
          <CreateWeeklyLog
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedLog(null);
            }}
            onSuccess={fetchWeeklyLogs}
            weeklyLog={selectedLog}
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
        <div className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Log History
            </h2>
            <p className="text-text-secondary text-md mt-1">
              Complete archive of your submitted professional journals
            </p>
          </div>

          <div className="overflow-x-auto">
            {isLoadingLogs ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-lg font-semibold text-text-secondary">
                  Loading weekly logs...
                </p>
              </div>
            ) : weeklyLogList && weeklyLogList.length > 0 ? (
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
                  {weeklyLogList?.map((log, i) => (
                    <tr
                      key={i}
                      className="hover:bg-background/50 transition-colors group"
                    >
                      <td className="py-5 px-4">
                        <span className="font-bold text-maroon-dark">
                          Week {log.week_number}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-sm text-text-secondary font-medium">
                        {new Date(log.week_start_date).toLocaleDateString()} -{" "}
                        {new Date(log.week_end_date).toLocaleDateString()}
                      </td>
                      <td className="py-5 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                          ${
                            log.status.toLowerCase() === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : log.status.toLowerCase() === "draft"
                                ? "bg-gray-200 text-gray-600"
                                : log.status.toLowerCase() === "submitted"
                                  ? "bg-orange-100 text-orange-700"
                                  : log.status.toLowerCase() === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-sm text-text-secondary/60 font-medium">
                        {log.submitted_at
                          ? new Date(log.submitted_at).toLocaleDateString()
                          : "Not submitted"}
                      </td>
                      <td className="py-5 px-4 text-right">
                        {log.status.toLowerCase() !== "draft" &&
                          log.status !== "changes_requested" && (
                            <button
                              onClick={() => {
                                setSelectedLog(log);
                                setIsModalOpen(true);
                              }}
                              className="hover:bg-gray-300 inline-flex items-center gap-2 text-xs font-bold text-gold hover:text-maroon transition-colors px-3 py-1.5 bg-gold/5 rounded-lg border border-gray-300"
                            >
                              <Eye size={14} />
                              View Details
                            </button>
                          )}{" "}
                        {(log.status.toLowerCase() == "draft" ||
                          log.status == "changes_requested") && (
                          <button
                            onClick={() => {
                              setSelectedLog(log);
                              setIsModalOpen(true);
                            }}
                            className=" hover:bg-gray-300 ml-2 inline-flex items-center gap-2 text-xs font-bold text-gold hover:text-maroon transition-colors px-3 py-1.5 bg-gold/5 rounded-lg border border-gray-300"
                          >
                            <Eye size={14} />
                            Edit Log
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-lg font-semibold text-text-secondary">
                  No weekly logs
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeeklyLogs;
