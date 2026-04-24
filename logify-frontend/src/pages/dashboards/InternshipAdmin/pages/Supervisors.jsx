import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Check,
  RefreshCcw,
  ShieldCheck,
  UserRoundCheck,
  X,
} from "lucide-react";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { api } from "../../../../config/api";

const roleLabels = {
  academic_supervisor: "Academic Supervisor",
  workplace_supervisor: "Workplace Supervisor",
};

const formatRole = (role) => roleLabels[role] || role || "Unknown";

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusVariant = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
};

const Supervisors = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeReviewId, setActiveReviewId] = useState(null);

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.accounts.getSupervisorApplications();
      setApplications(Array.isArray(response) ? response : []);
    } catch {
      setError("Unable to load supervisor applications.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    await loadApplications();
    toast.success("Applications refreshed");
  };

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleReview = async (applicationId, action) => {
    setActiveReviewId(applicationId);
    setError("");

    try {
      await api.accounts.reviewSupervisorApplication(applicationId, action);
      await loadApplications();
      toast.success(
        action === "approve"
          ? "Supervisor application approved!"
          : "Supervisor application rejected.",
      );
    } catch (reviewError) {
      toast.error(reviewError.message || "Unable to review application.");
      setError(reviewError.message || "Unable to review application.");
    } finally {
      setActiveReviewId(null);
    }
  };

  const pendingApplications = applications.filter(
    (application) => application.status === "pending",
  );
  const approvedApplications = applications.filter(
    (application) => application.status === "approved",
  );
  const academicSupervisors = approvedApplications.filter(
    (application) => application.role === "academic_supervisor",
  );
  const workplaceSupervisors = approvedApplications.filter(
    (application) => application.role === "workplace_supervisor",
  );

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-4 py-6 font-sans transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-maroon dark:text-slate-300 sm:text-4xl">
            Supervisor Management
          </h1>
          <p className="text-sm text-text-secondary dark:text-slate-300 sm:text-base lg:text-lg">
            Review new supervisor signups and manage approved supervisors.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading}
          className="border-border bg-white text-maroon-dark hover:bg-gold/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 inline-flex rounded-xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary dark:text-slate-400">
            Pending Approval
          </p>
          <p className="mt-2 text-3xl font-black text-maroon-dark dark:text-gold">
            {pendingApplications.length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <UserRoundCheck className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary dark:text-slate-400">
            Approved Supervisors
          </p>
          <p className="mt-2 text-3xl font-black text-maroon-dark dark:text-gold">
            {approvedApplications.length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary dark:text-slate-400">
            Academic Supervisors
          </p>
          <p className="mt-2 text-3xl font-black text-maroon-dark dark:text-gold">
            {academicSupervisors.length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary dark:text-slate-400">
            Workplace Supervisors
          </p>
          <p className="mt-2 text-3xl font-black text-maroon-dark dark:text-gold">
            {workplaceSupervisors.length}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-maroon dark:text-slate-300">
            Pending Supervisor Approvals
          </h2>
          <p className="text-text-secondary dark:text-slate-300">
            New supervisor signups appear here until an internship admin reviews
            them.
          </p>
        </div>

        <Table>
          <TableHead>
            <TableRow index={0}>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Phone</TableHeaderCell>
              <TableHeaderCell>Applied</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingApplications.length === 0 && !isLoading && (
              <TableRow index={0}>
                <TableCell className="py-6" colSpan={7}>
                  No pending supervisor applications right now.
                </TableCell>
              </TableRow>
            )}

            {isLoading && (
              <TableRow index={0}>
                <TableCell className="py-6" colSpan={7}>
                  Loading supervisor applications...
                </TableCell>
              </TableRow>
            )}

            {pendingApplications.map((application, index) => (
              <TableRow key={application.id} index={index}>
                <TableCell>{application.full_name}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {formatRole(application.role)}
                  </Badge>
                </TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>{application.phone || "N/A"}</TableCell>
                <TableCell>{formatDate(application.created_at)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[application.status]}>
                    {application.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleReview(application.id, "approve")}
                      disabled={activeReviewId === application.id}
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReview(application.id, "reject")}
                      disabled={activeReviewId === application.id}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-maroon dark:text-slate-300">
            Approved Supervisors
          </h2>
          <p className="text-text-secondary dark:text-slate-300">
            Supervisors that have already been approved and can access the
            platform.
          </p>
        </div>

        <Table>
          <TableHead>
            <TableRow index={0}>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Phone</TableHeaderCell>
              <TableHeaderCell>Department</TableHeaderCell>
              <TableHeaderCell>Approved</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvedApplications.length === 0 && !isLoading && (
              <TableRow index={0}>
                <TableCell className="py-6" colSpan={6}>
                  No approved supervisors yet.
                </TableCell>
              </TableRow>
            )}

            {approvedApplications.map((application, index) => (
              <TableRow key={application.id} index={index}>
                <TableCell>{application.full_name}</TableCell>
                <TableCell>
                  <Badge variant="default">
                    {formatRole(application.role)}
                  </Badge>
                </TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>{application.phone || "N/A"}</TableCell>
                <TableCell>
                  {application.staff_profile?.department_name || "N/A"}
                </TableCell>
                <TableCell>{formatDate(application.updated_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default Supervisors;
