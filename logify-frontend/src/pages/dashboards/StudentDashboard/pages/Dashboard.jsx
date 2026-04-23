import { Clock } from "lucide-react";
import MetricCard from "../../../../components/ui/MetricCard";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../../config/api";

const Dashboard = () => {
  const [finalResult, setFinalResult] = useState(null);
  const [isLoadingFinalResult, setIsLoadingFinalResult] = useState(true);
  const [placementData, setPlacementData] = useState(null);
  const [organizationData, setOrganizationData] = useState(null);
  const [weeklyLogData, setWeeklyLogData] = useState(null);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isLoadingPlacement, setIsLoadingPlacement] = useState(true);
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(false);
  const [workplaceSupervisorData, setWorkplaceSupervisorData] = useState(null);
  const [
    isLoadingWorkplaceSupervisorData,
    setIsLoadingWorkplaceSupervisorData,
  ] = useState(false);
  const [academicSupervisorData, setAcademicSupervisorData] = useState(null);
  const [isLoadingAcademicSupervisorData, setIsLoadingAcademicSupervisorData] =
    useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await api.auth.me();
        setUserData(data);
      } catch {
        setUserData(null);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchFinalResult = async () => {
      try {
        setIsLoadingFinalResult(true);
        const data = await api.evaluations.getResults();
        setFinalResult(data[0]);
      } catch {
        setFinalResult(null);
      } finally {
        setIsLoadingFinalResult(false);
      }
    };
    fetchFinalResult();
  }, []);

  useEffect(() => {
    const fetchWeeklyLogData = async () => {
      try {
        setIsLoadingLogs(true);
        const data = await api.logbook.getWeeklyLogs();
        setWeeklyLogData(data.weekly_logs ?? []);
      } catch {
        setWeeklyLogData([]);
      } finally {
        setIsLoadingLogs(false);
      }
    };
    fetchWeeklyLogData();
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
    if (placementData) {
      const fetchOrganizationData = async () => {
        try {
          setIsLoadingOrganization(true);
          const data = await api.organizations.getOrganization(
            placementData?.organization,
          );
          setOrganizationData(data);
        } catch {
          setOrganizationData(null);
        } finally {
          setIsLoadingOrganization(false);
        }
      };
      fetchOrganizationData();
    }
  }, [placementData]);

  useEffect(() => {
    if (placementData) {
      const fetchAcademicSupervisorData = async () => {
        try {
          setIsLoadingAcademicSupervisorData(true);
          const data = await api.accounts.getAcademicSupervisor(
            placementData.academic_supervisor,
          );
          setAcademicSupervisorData(data);
        } catch {
          setAcademicSupervisorData(null);
        } finally {
          setIsLoadingAcademicSupervisorData(false);
        }
      };
      fetchAcademicSupervisorData();
    }
  }, [placementData]);

  useEffect(() => {
    if (placementData) {
      const fetchWorkplaceSupervisorData = async () => {
        try {
          setIsLoadingWorkplaceSupervisorData(true);
          const data = await api.accounts.getWorkplaceSupervisor(
            placementData.workplace_supervisor,
          );
          setWorkplaceSupervisorData(data);
        } catch {
          setWorkplaceSupervisorData(null);
        } finally {
          setIsLoadingWorkplaceSupervisorData(false);
        }
      };
      fetchWorkplaceSupervisorData();
    }
  }, [placementData]);

  const person = {
    firstName: userData?.first_name,
    lastName: userData?.last_name,
  };

  const placementTimeline = useMemo(() => {
    if (!placementData) {
      return [];
    }

    const events = [];

    if (placementData.created_at) {
      events.push({
        title: "Placement Draft Saved",
        desc: "Your placement record was created and is ready for review.",
        time: placementData.created_at,
      });
    }

    if (placementData.submitted_at) {
      events.push({
        title: "Placement Submitted",
        desc: "Your internship placement was submitted for academic approval.",
        time: placementData.submitted_at,
      });
    }

    if (placementData.approved_at) {
      events.push({
        title: "Placement Approved",
        desc: "Your academic supervisor approved the placement.",
        time: placementData.approved_at,
      });
    }

    if (
      ["active", "completed"].includes(placementData.status) &&
      placementData.start_date
    ) {
      events.push({
        title: "Internship Started",
        desc: "Your internship placement moved into the active phase.",
        time: placementData.start_date,
      });
    }

    if (placementData.status === "completed" && placementData.end_date) {
      events.push({
        title: "Internship Completed",
        desc: "Your placement reached its scheduled end date.",
        time: placementData.end_date,
      });
    }

    return events;
  }, [placementData]);

  const recentActivity = useMemo(() => {
    const logActivities =
      weeklyLogData?.map((log) => ({
        title: `Week ${log.week_number} Log ${log.status === "approved" ? "Approved" : log.status === "submitted" ? "Submitted" : "Updated"}`,
        desc:
          log.status === "approved"
            ? "Your workplace supervisor approved this weekly submission."
            : log.status === "submitted"
              ? "Your weekly log was submitted to your workplace supervisor."
              : `Current status: ${log.status}.`,
        time: log.submitted_at || log.updated_at || log.created_at,
      })) ?? [];

    const resultActivities = finalResult
      ? [
          {
            title: "Final Result Available",
            desc: `Your current final score is ${finalResult.final_score ?? "unavailable"}%.`,
            time:
              finalResult.computed_at ||
              finalResult.updated_at ||
              placementData?.updated_at,
          },
        ]
      : [];

    return [...logActivities, ...placementTimeline, ...resultActivities]
      .filter((activity) => activity.time)
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  }, [
    finalResult,
    placementData?.updated_at,
    placementTimeline,
    weeklyLogData,
  ]);

  const placementStatusCapitalized = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const metrics = [
    {
      title: "Status",
      value: isLoadingPlacement
        ? "Loading..."
        : placementData
          ? placementStatusCapitalized(placementData?.status)
          : "No placement found",
      iconType: "placements",
    },
    {
      title: "Weekly Logs",
      value: isLoadingLogs
        ? "Loading..."
        : (!weeklyLogData && "Unavailable") || weeklyLogData?.length,
      iconType: "reviews",
    },
    {
      title: "Final Score",
      value: isLoadingFinalResult
        ? "Loading..."
        : finalResult
          ? `${finalResult?.final_score}%`
          : "Unavailable",
      iconType: "evaluations",
    },
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

      <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                Your placement details
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  Organization
                </p>
                <p className="text-lg font-bold text-maroon-dark mb-4">
                  {isLoadingOrganization
                    ? "Loading..."
                    : (organizationData?.name ?? "Unavailable")}
                </p>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  Workplace Supervisor
                </p>
                <p className="text-lg font-bold text-maroon-dark mb-4">
                  {isLoadingWorkplaceSupervisorData
                    ? "Loading..."
                    : workplaceSupervisorData
                      ? `${workplaceSupervisorData?.first_name} ${workplaceSupervisorData?.last_name}`
                      : "Not Assigned"}
                </p>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  Start Date
                </p>
                <p className="text-lg font-bold text-maroon-dark">
                  {isLoadingPlacement
                    ? "Loading..."
                    : (placementData?.start_date ?? "Unavailable")}
                </p>
              </div>
              <div>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  Internship Title
                </p>
                <p className="text-lg font-bold text-maroon-dark mb-4">
                  {isLoadingPlacement
                    ? "Loading..."
                    : (placementData?.internship_title ?? "Unavailable")}
                </p>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  Academic Supervisor
                </p>
                <p className="text-lg font-bold text-maroon-dark mb-4">
                  {isLoadingAcademicSupervisorData
                    ? "Loading..."
                    : academicSupervisorData
                      ? `${academicSupervisorData?.first_name} ${academicSupervisorData?.last_name}`
                      : "Not Assigned"}
                </p>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  End Date
                </p>
                <p className="text-lg font-bold text-maroon-dark">
                  {isLoadingPlacement
                    ? "Loading..."
                    : (placementData?.end_date ?? "Unavailable")}
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
              {recentActivity.length === 0 && (
                <div className="rounded-[12px] border border-border/30 bg-background/50 p-5 text-sm text-text-secondary">
                  No recent activity yet. Once you submit logs and move through
                  the placement workflow, updates will show here.
                </div>
              )}
              {recentActivity.map((activity, i) => (
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
                    {new Date(activity.time).toLocaleDateString()}
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
