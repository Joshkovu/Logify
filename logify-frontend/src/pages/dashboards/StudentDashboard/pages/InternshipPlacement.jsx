import { Clock, MapPin, Building2, User, Phone, Mail } from "lucide-react";
import MetricCard from "../../../../components/ui/MetricCard";
import CreatePlacement from "../CreatePlacement";
import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "../../../../config/api";
import { ToastContainer, toast } from "react-toastify";

const InternshipPlacement = () => {
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [organizationData, setOrganizationData] = useState(null);
  const [workplaceSupervisorData, setWorkplaceSupervisorData] = useState(null);
  const [
    isLoadingWorkplaceSupervisorData,
    setIsLoadingWorkplaceSupervisorData,
  ] = useState(false);
  const [academicSupervisorData, setAcademicSupervisorData] = useState(null);
  const [isLoadingAcademicSupervisorData, setIsLoadingAcademicSupervisorData] =
    useState(false);
  const [existingPlacement, setExistingPlacement] = useState(null);
  const [isLoadingPlacement, setIsLoadingPlacement] = useState(true);
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(false);
  const fetchPlacement = useCallback(async () => {
    try {
      setIsLoadingPlacement(true);
      const data = await api.placements.getPlacements();
      if (data.length > 0) setExistingPlacement(data[0]);
      else setExistingPlacement(null);
    } catch {
      setExistingPlacement(null);
    } finally {
      setIsLoadingPlacement(false);
    }
  }, []);

  useEffect(() => {
    fetchPlacement();
  }, [fetchPlacement]);

  useEffect(() => {
    if (existingPlacement) {
      const fetchAcademicSupervisorData = async () => {
        try {
          setIsLoadingAcademicSupervisorData(true);
          const data = await api.accounts.getAcademicSupervisor(
            existingPlacement.academic_supervisor,
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
  }, [existingPlacement]);

  useEffect(() => {
    if (existingPlacement) {
      const fetchWorkplaceSupervisorData = async () => {
        try {
          setIsLoadingWorkplaceSupervisorData(true);
          const data = await api.accounts.getWorkplaceSupervisor(
            existingPlacement.workplace_supervisor,
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
  }, [existingPlacement]);

  useEffect(() => {
    if (existingPlacement) {
      const fetchOrganizationData = async () => {
        try {
          setIsLoadingOrganization(true);
          const data = await api.organizations.getOrganization(
            existingPlacement?.organization,
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
  }, [existingPlacement]);

  const getWeeksBetweenDates = (date1, date2) => {
    const diffInMs = Math.abs(new Date(date2) - new Date(date1));
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
  };
  const getCurrentWeekInRange = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);

    if (today < start) return 0;

    const diffInMs = today - start;
    const msInWeek = 1000 * 60 * 60 * 24 * 7;

    return Math.floor(diffInMs / msInWeek) + 1;
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);

    // Normalize both dates to midnight to ignore time-of-day differences
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffInMs = end - today;
    const msInDay = 1000 * 60 * 60 * 24;

    // Calculate days
    const daysRemaining = Math.ceil(diffInMs / msInDay);

    // Return 0 if the date has already passed
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  const placementStatusCapitalized = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  const placementTimeline = useMemo(() => {
    if (!existingPlacement) {
      return [];
    }

    const timeline = [];

    if (existingPlacement.created_at) {
      timeline.push({
        title: "Placement Draft Saved",
        desc: "Your internship placement record was created.",
        time: existingPlacement.created_at,
      });
    }

    if (existingPlacement.submitted_at) {
      timeline.push({
        title: "Placement Submitted",
        desc: "You submitted your placement details for review.",
        time: existingPlacement.submitted_at,
      });
    }

    if (existingPlacement.approved_at) {
      timeline.push({
        title: "Placement Approved",
        desc: "Your academic supervisor approved the placement.",
        time: existingPlacement.approved_at,
      });
    }

    if (
      ["active", "completed"].includes(existingPlacement.status) &&
      existingPlacement.start_date
    ) {
      timeline.push({
        title: "Internship Started",
        desc: "Your internship is now in progress.",
        time: existingPlacement.start_date,
      });
    }

    if (
      ["rejected", "cancelled"].includes(existingPlacement.status) &&
      existingPlacement.updated_at
    ) {
      timeline.push({
        title: `Placement ${placementStatusCapitalized(existingPlacement.status)}`,
        desc: "The placement workflow ended before internship completion.",
        time: existingPlacement.updated_at,
      });
    }

    if (
      existingPlacement.status === "completed" &&
      existingPlacement.end_date
    ) {
      timeline.push({
        title: "Internship Completed",
        desc: "Your placement reached its planned completion date.",
        time: existingPlacement.end_date,
      });
    }

    return timeline.sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [existingPlacement]);

  const metrics = [
    {
      title: "Placement Status",
      value: isLoadingPlacement
        ? "Loading..."
        : existingPlacement
          ? `${placementStatusCapitalized(existingPlacement?.status)}`
          : "No placement found",
      iconType: "placements",
    },
    {
      title: "Total Duration",
      value: isLoadingPlacement
        ? "Loading..."
        : existingPlacement
          ? `${getWeeksBetweenDates(existingPlacement?.start_date, existingPlacement?.end_date)} Weeks`
          : "N/A",
      iconType: "reviews",
    },
    {
      title: "Current Week",
      value: isLoadingPlacement
        ? "Loading..."
        : existingPlacement
          ? `Week ${getCurrentWeekInRange(existingPlacement?.start_date)}`
          : "N/A",
      iconType: "reviews",
    },
    {
      title: "Days Remaining",
      value: isLoadingPlacement
        ? "Loading..."
        : existingPlacement
          ? `${getDaysRemaining(existingPlacement?.end_date)}`
          : "N/A",
      iconType: "reviews",
    },
  ];

  const creationSuccessNotification = () =>
    toast.success("Placement created successfully!");
  const editSuccessNotification = () =>
    toast.success("Placement edited successfully!");
  const submissionSuccessNotification = () =>
    toast.success("Placement submitted successfully!");

  const handlePlacementAction = useCallback(
    (action) => {
      fetchPlacement();
      switch (action) {
        case "created":
          creationSuccessNotification();
          break;
        case "edited":
          editSuccessNotification();
          break;
        case "submitted":
          submissionSuccessNotification();
          break;
      }
    },
    [fetchPlacement],
  );

  return (
    <div className="dark:bg-slate-950 min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans">
      <ToastContainer position="top-right" />
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
            Internship Placement
          </h1>
          <p className="text-lg text-text-secondary/80 max-w-lg leading-relaxed">
            View and manage your internship placement details and organization
            contact info.
          </p>
        </div>
        {isLoadingPlacement ? (
          <p className="text-sm text-white font-bold transition-all px-6 py-3 bg-maroonCustom rounded-xl">
            Loading...
          </p>
        ) : !existingPlacement || existingPlacement.status === "draft" ? (
          <button
            onClick={() => setIsPlacementModalOpen(true)}
            className="text-sm text-white font-bold hover:bg-red-800 transition-all px-6 py-3 bg-maroonCustom rounded-xl shadow-sm"
          >
            {existingPlacement ? "Edit Placement" : "Create Placement"}
          </button>
        ) : (
          ""
        )}
        <CreatePlacement
          key={isPlacementModalOpen ? "open" : "closed"}
          isOpen={isPlacementModalOpen}
          onClose={() => setIsPlacementModalOpen(false)}
          placement={existingPlacement ?? null}
          onAction={handlePlacementAction}
        />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {metrics.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            iconType={m.iconType}
          />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border transition-transform">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Organization Details
            </h2>
            <p className="text-text-secondary text-md mt-1">
              Host organization information and contact
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gold/10 rounded-xl text-gold">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-text-secondary/60 mb-1">
                  Organization Name
                </p>
                <p className="text-lg font-bold text-maroon-dark">
                  {isLoadingOrganization
                    ? "Loading..."
                    : (organizationData?.name ?? "Not available")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-gold/10 rounded-xl text-gold">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-text-secondary/60 mb-1">
                  Physical Address
                </p>
                <p className="text-lg font-bold text-maroon-dark leading-snug">
                  {isLoadingOrganization
                    ? "Loading..."
                    : (organizationData?.address ?? "Not available")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 p-2">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-2 bg-gold/5 rounded-lg text-gold">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-text-secondary/60 mb-1">
                    Contact
                  </p>
                  <p className="text-sm font-bold text-maroon-dark">
                    {isLoadingOrganization
                      ? "Loading..."
                      : (organizationData?.contact_phone ?? "Not available")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-text-secondary/60 mb-1">
                    Email
                  </p>
                  <p className="text-sm font-bold text-maroon-dark truncate">
                    {isLoadingOrganization
                      ? "Loading..."
                      : (organizationData?.contact_email ?? "Not available")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border transition-transform">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Supervisor Records
            </h2>
            <p className="text-text-secondary text-md mt-1">
              Assigned workplace and academic mentors
            </p>
          </div>

          <div className="space-y-8">
            <div className="p-6 bg-background/50 rounded-[12px] border border-gray-200">
              <div className="flex mb-4">
                <div className="h-12 w-12 rounded-full bg-maroon-dark flex items-center ">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-maroon-dark">
                    {isLoadingWorkplaceSupervisorData
                      ? "Loading..."
                      : workplaceSupervisorData
                        ? `${workplaceSupervisorData?.first_name} ${workplaceSupervisorData?.last_name}`
                        : "Not Assigned"}
                  </h3>
                  <p className="text-[10px] uppercase font-bold text-maroonCustom tracking-widest">
                    Workplace Supervisor
                  </p>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 text-sm font-semibold text-text-secondary">
                <div>
                  <p className="text-[10px] uppercase text-text-secondary/40 mb-1">
                    Email
                  </p>
                  <p className="text-maroon-dark truncate">
                    {isLoadingWorkplaceSupervisorData
                      ? "Loading..."
                      : workplaceSupervisorData
                        ? `${workplaceSupervisorData?.email}`
                        : "Unavailable"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gold/5 rounded-[12px] border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center text-maroon-dark">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {isLoadingAcademicSupervisorData
                      ? "Loading..."
                      : academicSupervisorData
                        ? `${academicSupervisorData?.first_name} ${academicSupervisorData?.last_name}`
                        : "Not Assigned"}
                  </h3>
                  <p className="text-[10px] uppercase font-bold text-maroonCustom tracking-widest">
                    Academic Supervisor
                  </p>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 text-sm font-semibold text-text-secondary">
                <div>
                  <p className="text-[10px] uppercase text-text-secondary/40 mb-1">
                    Email
                  </p>
                  <p className="text-maroon-dark truncate">
                    {isLoadingAcademicSupervisorData
                      ? "Loading..."
                      : academicSupervisorData
                        ? `${academicSupervisorData?.email}`
                        : "Unavailable"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Status Timeline
            </h2>
            <p className="text-text-secondary text-md mt-1">
              History of your placement status changes
            </p>
          </div>

          <div className="space-y-4">
            {placementTimeline.length === 0 && (
              <div className="rounded-[12px] border border-border/30 bg-background/50 p-5 text-sm text-text-secondary">
                Placement milestones will appear here once your submission moves
                through review.
              </div>
            )}
            {placementTimeline.map((activity, i) => (
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
  );
};

export default InternshipPlacement;
