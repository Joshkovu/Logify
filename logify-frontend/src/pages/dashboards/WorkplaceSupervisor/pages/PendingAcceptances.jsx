import { useEffect, useMemo, useState } from "react";
import { Check, X, Info, AlertCircle } from "lucide-react";
import {
  formatDate,
  loadWorkplaceSupervisorData,
} from "../utils/workplaceSupervisorData";
import { api } from "../../../../config/api";

const PendingAcceptances = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [placements, setPlacements] = useState([]);
  const [usersById, setUsersById] = useState({});
  const [organizationsById, setOrganizationsById] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const snapshot = await loadWorkplaceSupervisorData();
      setPlacements(snapshot.placements);
      setUsersById(snapshot.usersById);
      setOrganizationsById(snapshot.organizationsById);
    } catch (loadError) {
      setError(loadError.message || "Unable to load pending placements.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingPlacements = useMemo(
    () => placements.filter((p) => p.status === "approved"),
    [placements],
  );

  const handleAccept = async (id) => {
    if (!window.confirm("Are you sure you want to accept this intern?")) return;
    setProcessingId(id);
    setError("");
    setSuccess("");
    try {
      await api.placements.wsAcceptPlacement(id);
      setSuccess("Placement accepted successfully!");
      fetchData(); // Refresh list
    } catch (err) {
      setError(err.message || "Failed to accept placement.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeny = async (id) => {
    const reason = window.prompt(
      "Please provide a reason for denying this placement (optional):",
    );
    if (reason === null) return; // Cancelled prompt

    setProcessingId(id);
    setError("");
    setSuccess("");
    try {
      await api.placements.wsDenyPlacement(id, { comment: reason });
      setSuccess("Placement denied.");
      fetchData(); // Refresh list
    } catch (err) {
      setError(err.message || "Failed to deny placement.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#FCFBF8] p-8 transition-all dark:bg-slate-950 lg:p-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Pending Acceptances</h1>
        <p className="text-lg font-light text-gray-600 dark:text-slate-400">
          Review and respond to internship placement requests assigned to you.
        </p>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
          <Check className="h-5 w-5" />
          {success}
        </div>
      )}

      <section className="mt-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
            <span className="ml-3 text-gray-500">Loading requests...</span>
          </div>
        ) : pendingPlacements.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 py-20 text-center dark:border-slate-800">
            <div className="rounded-full bg-stone-100 p-4 dark:bg-slate-900">
              <Info className="h-8 w-8 text-stone-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No Pending Requests</h3>
            <p className="mt-1 text-gray-500 dark:text-slate-400">
              There are no placements currently awaiting your acceptance.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {pendingPlacements.map((placement) => {
              const intern = usersById[placement.intern];
              const org = organizationsById[placement.organization];
              return (
                <article
                  key={placement.id}
                  className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-xl font-bold text-gold">
                          {intern?.first_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {intern
                              ? `${intern.first_name} ${intern.last_name}`
                              : "Unknown Student"}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {intern?.email || "No email provided"}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        Awaiting Your Review
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            Internship Title
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {placement.internship_title}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            Organization
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {org?.name || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            Duration
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {formatDate(placement.start_date)} -{" "}
                            {formatDate(placement.end_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            Work Mode
                          </p>
                          <p className="mt-1 text-sm font-semibold capitalize">
                            {placement.work_mode}
                          </p>
                        </div>
                      </div>

                      {placement.department_at_company && (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            Department
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {placement.department_at_company}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex gap-3">
                      <button
                        onClick={() => handleAccept(placement.id)}
                        disabled={processingId === placement.id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        {processingId === placement.id
                          ? "Processing..."
                          : "Accept Intern"}
                      </button>
                      <button
                        onClick={() => handleDeny(placement.id)}
                        disabled={processingId === placement.id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        Deny
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default PendingAcceptances;
