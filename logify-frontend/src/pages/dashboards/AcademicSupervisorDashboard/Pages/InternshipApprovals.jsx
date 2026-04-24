import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "../../../../components/ui/ThemeToggle";
import MetricCard from "../../../../components/ui/MetricCard";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  User,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import { api } from "../../../../config/api";
import {
  formatDate,
  formatDateRange,
  getUserDisplayName,
  loadAcademicSupervisorData,
} from "../utils/academicSupervisorData";

const InternshipApprovals = () => {
  const [isDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [snapshot, setSnapshot] = useState({
    placements: [],
    usersById: {},
    organizationsById: {},
    workplaceSupervisorsById: {},
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

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await loadAcademicSupervisorData();
        setSnapshot({
          placements: data.placements,
          usersById: data.usersById,
          organizationsById: data.organizationsById,
          workplaceSupervisorsById: data.workplaceSupervisorsById,
        });
      } catch (loadError) {
        setError(loadError.message || "Unable to load internship approvals.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const { placements, usersById, organizationsById, workplaceSupervisorsById } =
    snapshot;

  const mappedApprovals = useMemo(
    () =>
      placements.map((placement) => {
        const student = usersById[placement.intern];
        const organization = organizationsById[placement.organization];
        const workplaceSupervisor =
          workplaceSupervisorsById[placement.workplace_supervisor];

        return {
          id: placement.id,
          name: getUserDisplayName(student, "Intern"),
          regNo: student?.student_number || "Unavailable",
          program: placement.internship_title || "Placement unavailable",
          submittedOn: formatDate(
            placement.submitted_at || placement.created_at,
          ),
          organization: organization?.name || "Unknown organization",
          address: organization?.address || "Address unavailable",
          position: placement.internship_title || "Internship Placement",
          duration: formatDateRange(placement.start_date, placement.end_date),
          supervisor: getUserDisplayName(
            workplaceSupervisor,
            "Workplace supervisor not assigned",
          ),
          email:
            workplaceSupervisor?.email ||
            organization?.contact_email ||
            "Unavailable",
          phone:
            workplaceSupervisor?.phone ||
            organization?.contact_phone ||
            "Unavailable",
          status: placement.status,
          actionDate: formatDate(placement.approved_at || placement.updated_at),
        };
      }),
    [organizationsById, placements, usersById, workplaceSupervisorsById],
  );

  const pendingApprovals = useMemo(
    () => mappedApprovals.filter((item) => item.status === "submitted"),
    [mappedApprovals],
  );

  const approvedApprovals = useMemo(
    () => mappedApprovals.filter((item) => item.status === "approved"),
    [mappedApprovals],
  );

  const declinedApprovals = useMemo(
    () => mappedApprovals.filter((item) => item.status === "rejected"),
    [mappedApprovals],
  );

  const stats = useMemo(() => {
    const totalProcessed = approvedApprovals.length + declinedApprovals.length;
    const rate =
      totalProcessed === 0
        ? 0
        : Math.round((approvedApprovals.length / totalProcessed) * 100);

    return [
      {
        title: "Pending Approvals",
        value: isLoading ? "..." : String(pendingApprovals.length),
        iconType: "placements",
      },
      {
        title: "Approved This Month",
        value: isLoading ? "..." : String(approvedApprovals.length),
        iconType: "evaluations",
      },
      {
        title: "Approval Rate",
        value: isLoading ? "..." : `${rate}%`,
        iconType: "reviews",
      },
    ];
  }, [
    approvedApprovals.length,
    declinedApprovals.length,
    isLoading,
    pendingApprovals.length,
  ]);

  const updatePlacementStatus = (placementId, nextStatus, updatedPlacement) => {
    setSnapshot((current) => ({
      ...current,
      placements: current.placements.map((placement) =>
        placement.id === placementId
          ? { ...placement, ...updatedPlacement, status: nextStatus }
          : placement,
      ),
    }));
  };

  const handleApprove = async (item) => {
    setActionId(item.id);
    setError("");

    try {
      const response = await api.placements.approvePlacement(item.id);
      updatePlacementStatus(item.id, "approved", response || {});
    } catch (actionError) {
      setError(actionError.message || "Unable to approve this request.");
    } finally {
      setActionId(null);
    }
  };

  const handleDecline = async (item) => {
    setActionId(item.id);
    setError("");

    try {
      const response = await api.placements.rejectPlacement(item.id);
      updatePlacementStatus(item.id, "rejected", response || {});
    } catch (actionError) {
      setError(actionError.message || "Unable to decline this request.");
    } finally {
      setActionId(null);
    }
  };

  const pageCard =
    "rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:scale-102 sm:p-6 lg:p-8 xl:p-10";

  const infoCard =
    "rounded-2xl border border-border dark:border-slate-700/30 bg-background dark:bg-slate-800/50 p-4 sm:p-6";

  const sectionLabel =
    "text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/50 dark:text-slate-400";

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
      <div className="mb-5 -mx-4 flex items-center justify-between border-b border-border px-4 pb-1.5 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 xl:-mx-12 xl:px-12">
        <h1 className="text-sm font-bold uppercase tracking-[0.18em] text-black/70 dark:text-slate-300 sm:text-base">
          LOGIFY ACADEMIC SUPERVISOR
        </h1>

        <ThemeToggle />
      </div>

      <header className="mb-8 sm:mb-10 lg:mb-12">
        <h1 className="mb-3 text-3xl font-black tracking-tighter text-maroon-dark dark:text-white sm:text-4xl lg:text-5xl">
          Internship <span className="text-gold">Approvals</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary/80 dark:text-slate-300 sm:text-base lg:text-lg">
          Review and authorize student internship placement requests for the
          current semester.
        </p>
        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-8">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            iconType={stat.iconType}
          />
        ))}
      </section>

      <section className="space-y-6 sm:space-y-8">
        {pendingApprovals.length > 0 ? (
          pendingApprovals.map((item) => (
            <div key={item.id} className={pageCard}>
              <div className="mb-8 flex flex-col gap-6 border-b border-border/50 pb-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-xl font-black text-gold dark:text-slate-300 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">
                    {item.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl lg:text-3xl">
                        {item.name}
                      </h2>

                      <div className="flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1">
                        <Clock
                          size={16}
                          className="text-gold dark:text-slate-300"
                        />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold dark:text-slate-300">
                          Pending
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary dark:text-slate-300 sm:text-sm">
                      Reg: {item.regNo} &bull; {item.program}
                    </p>

                    <div className="mt-4">
                      <p className={sectionLabel}>Submission Date</p>
                      <p className="mt-1 text-sm font-bold text-maroon-dark dark:text-white">
                        {item.submittedOn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className={infoCard}>
                  <div className="mb-4 flex items-center gap-2 text-maroonCustom dark:text-slate-300">
                    <Building2 size={18} />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">
                      Organization Details
                    </h3>
                  </div>

                  <p className="text-base font-bold text-maroon-dark dark:text-white sm:text-lg">
                    {item.organization}
                  </p>

                  <div className="mt-4 flex items-start gap-3 text-text-secondary dark:text-slate-300">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <p className="text-sm leading-relaxed">{item.address}</p>
                  </div>
                </div>

                <div className={infoCard}>
                  <div className="mb-4 flex items-center gap-2 text-maroonCustom dark:text-slate-300">
                    <Briefcase size={18} />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">
                      Placement Specifics
                    </h3>
                  </div>

                  <p className="text-base font-bold text-maroon-dark dark:text-white sm:text-lg">
                    {item.position}
                  </p>

                  <div className="mt-4 flex items-start gap-3 text-text-secondary dark:text-slate-300">
                    <Calendar size={16} className="mt-0.5 shrink-0" />
                    <p className="text-sm leading-relaxed">{item.duration}</p>
                  </div>
                </div>

                <div className={infoCard}>
                  <div className="mb-4 flex items-center gap-2 text-maroonCustom dark:text-slate-300">
                    <User size={18} />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">
                      Workplace Supervisor
                    </h3>
                  </div>

                  <p className="text-base font-bold text-maroon-dark dark:text-white sm:text-lg">
                    {item.supervisor}
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-text-secondary dark:text-slate-300">
                      <Mail size={16} className="shrink-0" />
                      <p className="text-sm break-all">{item.email}</p>
                    </div>

                    <div className="flex items-center gap-3 text-text-secondary dark:text-slate-300">
                      <Phone size={16} className="shrink-0" />
                      <p className="text-sm">{item.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border/50 pt-8 md:flex-row">
                <button
                  onClick={() => handleApprove(item)}
                  disabled={actionId === item.id}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-700 bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={18} />
                  {actionId === item.id ? "Approving..." : "Approve Request"}
                </button>

                <button
                  onClick={() => handleDecline(item)}
                  disabled={actionId === item.id}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-4 py-3 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-300"
                >
                  <XCircle size={18} />
                  {actionId === item.id ? "Declining..." : "Decline Request"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[12px] border border-border bg-card p-6 text-center sm:p-8 lg:p-10">
            <p className="text-base font-semibold text-muted-foreground sm:text-lg">
              {isLoading
                ? "Loading internship approvals..."
                : "No pending internship approvals at the moment."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default InternshipApprovals;
