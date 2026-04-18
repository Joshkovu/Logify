import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import StatusBadge from "../../../../components/ui/StatusBadge";
import { Button } from "../../../../components/ui/Button";
import { api } from "../../../../config/api";

const normalizeCollection = (payload, key) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const toDisplayName = (student = {}) => {
  const fullName = [
    student.full_name,
    [student.first_name, student.last_name].filter(Boolean).join(" ").trim(),
  ].find(Boolean);

  if (fullName) return fullName;

  const emailName = student.webmail || student.email || "";
  const localPart = emailName.split("@")[0];
  if (!localPart) return "Unknown Student";

  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const toTitleCase = (value = "") =>
  value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const formatDate = (value) => {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getDurationInDays = (startDate, endDate) => {
  if (!startDate || !endDate) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return null;

  return Math.round(diffMs / 86400000) + 1;
};

const formatDuration = (days) => {
  if (!days) return "--";
  if (days < 30) return `${days} day${days === 1 ? "" : "s"}`;

  const months = days / 30;
  return `${months.toFixed(months >= 10 ? 0 : 1)} months`;
};

const getPlacementTimestamp = (placement) =>
  placement.updated_at ||
  placement.approved_at ||
  placement.submitted_at ||
  placement.created_at ||
  0;

const Placements = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [placements, setPlacements] = useState([]);
  const [students, setStudents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlacement, setSelectedPlacement] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPlacements = async () => {
      setLoading(true);
      setError("");

      const [placementsResult, studentsResult, organizationsResult] =
        await Promise.allSettled([
          api.placements.getPlacements(),
          api.registry.getStudents(),
          api.organizations.getOrganizations(),
        ]);

      if (!isMounted) return;

      setPlacements(
        placementsResult.status === "fulfilled"
          ? normalizeCollection(placementsResult.value, "placements")
          : [],
      );
      setStudents(
        studentsResult.status === "fulfilled"
          ? normalizeCollection(studentsResult.value, "students")
          : [],
      );
      setOrganizations(
        organizationsResult.status === "fulfilled"
          ? normalizeCollection(organizationsResult.value, "organizations")
          : [],
      );

      if (
        [placementsResult, studentsResult, organizationsResult].every(
          (result) => result.status === "rejected",
        )
      ) {
        setError("Unable to load placement records right now.");
      }

      setLoading(false);
    };

    fetchPlacements();

    return () => {
      isMounted = false;
    };
  }, []);

  const studentMap = students.reduce((acc, student) => {
    acc[String(student.id)] = student;
    return acc;
  }, {});

  const organizationMap = organizations.reduce((acc, organization) => {
    acc[String(organization.id)] = organization;
    return acc;
  }, {});

  const placementRows = placements
    .map((placement) => {
      const student =
        studentMap[String(placement.intern)] ||
        students.find(
          (item) =>
            String(item.student_number || "") ===
            String(
              placement.student_number || placement.intern_student_number || "",
            ),
        ) ||
        null;
      const organization =
        organizationMap[String(placement.organization)] || null;
      const durationDays = getDurationInDays(
        placement.start_date,
        placement.end_date,
      );

      return {
        id: placement.id,
        raw: placement,
        studentName: toDisplayName(student || {}),
        studentNumber: student?.student_number || "--",
        studentEmail: student?.webmail || student?.email || "--",
        organizationName: organization?.name || "Unknown Organization",
        organizationIndustry: organization?.industry || "--",
        organizationEmail: organization?.contact_email || "--",
        position: placement.internship_title || "Untitled Internship",
        department: placement.department_at_company || "--",
        workMode: toTitleCase(String(placement.work_mode || "unspecified")),
        status: toTitleCase(String(placement.status || "draft")),
        startDate: formatDate(placement.start_date),
        endDate: formatDate(placement.end_date),
        durationDays,
        durationLabel: formatDuration(durationDays),
      };
    })
    .sort(
      (a, b) =>
        new Date(getPlacementTimestamp(b.raw)).getTime() -
        new Date(getPlacementTimestamp(a.raw)).getTime(),
    );

  const filteredPlacements = placementRows.filter((placement) =>
    [
      placement.studentName,
      placement.studentNumber,
      placement.studentEmail,
      placement.organizationName,
      placement.organizationIndustry,
      placement.position,
      placement.department,
      placement.workMode,
      placement.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const totalPlacements = placementRows.length;
  const ongoingPlacements = placementRows.filter((placement) =>
    ["Approved", "Active"].includes(placement.status),
  ).length;
  const completedPlacements = placementRows.filter(
    (placement) => placement.status === "Completed",
  ).length;
  const averageDurationDays = (() => {
    const durations = placementRows
      .map((placement) => placement.durationDays)
      .filter((value) => typeof value === "number");

    if (durations.length === 0) return null;

    return Math.round(
      durations.reduce((sum, value) => sum + value, 0) / durations.length,
    );
  })();

  const stats = [
    { label: "Total Placements", value: loading ? "..." : totalPlacements },
    {
      label: "Ongoing Placements",
      value: loading ? "..." : ongoingPlacements,
    },
    {
      label: "Completed Placements",
      value: loading ? "..." : completedPlacements,
    },
    {
      label: "Average Duration",
      value: loading ? "..." : formatDuration(averageDurationDays),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-maroon dark:text-slate-300 sm:text-4xl">
          Placement Management
        </h1>
        <p className="text-sm text-text-secondary dark:text-slate-300 sm:text-base lg:text-lg">
          Oversee all internship placements and their statuses
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8"
          >
            <span className="mb-1 text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-300">
              {stat.label}
            </span>
            <span className="text-3xl font-extrabold text-green-600 dark:text-emerald-400">
              {stat.value}
            </span>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-bold text-maroon dark:text-slate-300">
              Recent Placements
            </h2>
            <p className="text-text-secondary dark:text-slate-300">
              {loading
                ? "Loading placement records..."
                : `Showing ${filteredPlacements.length} of ${totalPlacements} placements`}
            </p>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search placements..."
            className="w-full rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold sm:min-w-72"
          />
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        <Table>
          <TableHead>
            <TableRow index={0}>
              <TableHeaderCell>Student</TableHeaderCell>
              <TableHeaderCell>Organization</TableHeaderCell>
              <TableHeaderCell>Position</TableHeaderCell>
              <TableHeaderCell>Duration</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlacements.length > 0 ? (
              filteredPlacements.map((placement, idx) => (
                <TableRow key={placement.id} index={idx}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-text-primary dark:text-slate-100">
                        {placement.studentName}
                      </div>
                      <div className="text-xs text-text-secondary dark:text-slate-400">
                        {placement.studentNumber !== "--"
                          ? `Student No. ${placement.studentNumber}`
                          : placement.studentEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-text-primary dark:text-slate-100">
                        {placement.organizationName}
                      </div>
                      <div className="text-xs text-text-secondary dark:text-slate-400">
                        {placement.organizationIndustry}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{placement.position}</div>
                      <div className="text-xs text-text-secondary dark:text-slate-400">
                        {placement.workMode}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{placement.durationLabel}</div>
                      <div className="text-xs text-text-secondary dark:text-slate-400">
                        {placement.startDate} to {placement.endDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={placement.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPlacement(placement)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow index={0}>
                <TableCell colSpan={6}>
                  <div className="py-6 text-center text-sm text-text-secondary dark:text-slate-400">
                    {loading
                      ? "Loading placements..."
                      : "No placements matched the current search."}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {selectedPlacement ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-maroon dark:text-slate-100">
                  {selectedPlacement.position}
                </h3>
                <p className="mt-1 text-sm text-text-secondary dark:text-slate-400">
                  Placement #{selectedPlacement.id}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPlacement(null)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Student
                </div>
                <div className="mt-2 font-semibold text-text-primary dark:text-slate-100">
                  {selectedPlacement.studentName}
                </div>
                <div className="mt-1 text-sm text-text-secondary dark:text-slate-400">
                  {selectedPlacement.studentNumber !== "--"
                    ? `Student No. ${selectedPlacement.studentNumber}`
                    : selectedPlacement.studentEmail}
                </div>
              </div>

              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Organization
                </div>
                <div className="mt-2 font-semibold text-text-primary dark:text-slate-100">
                  {selectedPlacement.organizationName}
                </div>
                <div className="mt-1 text-sm text-text-secondary dark:text-slate-400">
                  {selectedPlacement.organizationEmail}
                </div>
              </div>

              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Schedule
                </div>
                <div className="mt-2 font-semibold text-text-primary dark:text-slate-100">
                  {selectedPlacement.startDate} to {selectedPlacement.endDate}
                </div>
                <div className="mt-1 text-sm text-text-secondary dark:text-slate-400">
                  {selectedPlacement.durationLabel}
                </div>
              </div>

              <div className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
                  Status
                </div>
                <div className="mt-2">
                  <StatusBadge status={selectedPlacement.status} />
                </div>
                <div className="mt-2 text-sm text-text-secondary dark:text-slate-400">
                  {selectedPlacement.workMode} • {selectedPlacement.department}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Placements;
