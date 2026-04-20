import { Clock } from "lucide-react";
import MetricCard from "../../../../components/ui/MetricCard";
import { useState, useEffect } from "react";
import { api } from "../../../../config/api";

const Dashboard = () => {
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
  ] = useState(true);
  const [academicSupervisorData, setAcademicSupervisorData] = useState(null);
  const [isLoadingAcademicSupervisorData, setIsLoadingAcademicSupervisorData] =
    useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await api.auth.me();
        setUserData(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchWeeklyLogData = async () => {
      try {
        setIsLoadingLogs(true);
        const data = await api.logbook.getWeeklyLogs();
        setWeeklyLogData(data.weekly_logs ?? []);
      } catch (err) {
        console.error(err.message);
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
      } catch (err) {
        console.error(err.message);
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
          console.log("fetched org data");
        } catch (err) {
          console.error(err);
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
          console.log("academic: ", data);
          setAcademicSupervisorData(data);
        } catch (err) {
          console.error("failed to get academic supervisor: ", err);
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
          console.log("workplace: ", data);
          setWorkplaceSupervisorData(data);
        } catch (err) {
          console.error("failed to get workplace supervisor: ", err);
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
                    : (organizationData?.name ?? "Not assigned")}
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
                    : (placementData?.start_date ?? "Not set")}
                </p>
              </div>
              <div>
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-1">
                  Internship Title
                </p>
                <p className="text-lg font-bold text-maroon-dark mb-4">
                  {isLoadingPlacement
                    ? "Loading..."
                    : (placementData?.internship_title ?? "Not set")}
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
                    : (placementData?.end_date ?? "Not set")}
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
