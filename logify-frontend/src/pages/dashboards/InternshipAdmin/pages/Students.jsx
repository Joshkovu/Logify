import { useCallback, useEffect, useState } from "react";
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
    student.name,
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

const approvalStatuses = new Set(["approved", "active", "completed"]);
const activeStatuses = new Set(["approved", "active"]);
const pendingStatuses = new Set(["draft", "submitted", "pending"]);

const getId = (value) => {
  if (value && typeof value === "object") return value.id || value.pk || "";
  return value || "";
};

const getTimestamp = (record = {}) =>
  record.updated_at ||
  record.approved_at ||
  record.submitted_at ||
  record.created_at ||
  0;

const getProgrammeName = (student, programmeMap) => {
  const directName =
    student.programme_name ||
    student.program_name ||
    student.programme?.name ||
    student.program?.name;

  if (directName) return directName;

  const programmeId =
    getId(student.programme) ||
    getId(student.program) ||
    student.programme_id ||
    student.program_id;

  return programmeMap[String(programmeId)] || "Programme not set";
};

const getPlacementTitle = (placement, student) =>
  placement?.internship_title ||
  placement?.title ||
  placement?.position ||
  placement?.role ||
  student.internship_title ||
  student.placement_title ||
  student.organization_name ||
  placement?.organization_name ||
  placement?.organization?.name ||
  "--";

const isPlacementForStudent = (placement, student) => {
  const placementId = String(placement.id || "");
  const studentPlacementId = String(
    getId(student.placement) || student.placement_id || "",
  );
  const placementInternId = String(
    getId(placement.intern) ||
      placement.intern_id ||
      getId(placement.student) ||
      placement.student_id ||
      "",
  );
  const studentIds = [
    student.id,
    getId(student.user),
    student.user_id,
    getId(student.account),
    student.account_id,
  ]
    .filter(Boolean)
    .map(String);
  const placementStudentNumber = String(
    placement.student_number ||
      placement.intern_student_number ||
      placement.intern?.student_number ||
      placement.student?.student_number ||
      "",
  );
  const studentNumber = String(student.student_number || "");
  const placementEmail = String(
    placement.student_email ||
      placement.intern_email ||
      placement.intern?.webmail ||
      placement.intern?.email ||
      "",
  ).toLowerCase();
  const studentEmail = String(
    student.webmail || student.email || "",
  ).toLowerCase();

  return (
    (studentPlacementId && placementId === studentPlacementId) ||
    (placementInternId && studentIds.includes(placementInternId)) ||
    (placementStudentNumber && placementStudentNumber === studentNumber) ||
    (placementEmail && placementEmail === studentEmail)
  );
};

const getLatestPlacementForStudent = (placements, student) =>
  placements
    .filter((placement) => isPlacementForStudent(placement, student))
    .sort(
      (a, b) =>
        new Date(getTimestamp(b)).getTime() -
        new Date(getTimestamp(a)).getTime(),
    )[0] || null;

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
      setError("");
    }

    const [studentsResult, programmesResult, placementsResult, resultsResult] =
      await Promise.allSettled([
        api.registry.getStudents(),
        api.academics.getProgrammes(),
        api.placements.getPlacements(),
        api.evaluations.getResults(),
      ]);

    if (studentsResult.status === "fulfilled") {
      setStudents(normalizeCollection(studentsResult.value, "students"));
    } else if (!silent) {
      setStudents([]);
    }

    if (programmesResult.status === "fulfilled") {
      setProgrammes(normalizeCollection(programmesResult.value, "programmes"));
    } else if (!silent) {
      setProgrammes([]);
    }

    if (placementsResult.status === "fulfilled") {
      setPlacements(normalizeCollection(placementsResult.value, "placements"));
    } else if (!silent) {
      setPlacements([]);
    }

    if (resultsResult.status === "fulfilled") {
      setResults(normalizeCollection(resultsResult.value, "results"));
    } else if (!silent) {
      setResults([]);
    }

    const failures = [
      studentsResult,
      programmesResult,
      placementsResult,
      resultsResult,
    ].filter((result) => result.status === "rejected");

    if (failures.length === 4) {
      setError("Unable to load student analytics right now.");
    } else {
      setError("");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchData());

    const refreshData = () => fetchData({ silent: true });
    const intervalId = window.setInterval(refreshData, 15000);
    window.addEventListener("focus", refreshData);
    document.addEventListener("visibilitychange", refreshData);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshData);
      document.removeEventListener("visibilitychange", refreshData);
    };
  }, [fetchData]);

  const programmeMap = programmes.reduce((acc, programme) => {
    acc[String(programme.id)] =
      programme.name || programme.title || programme.code || "Programme";
    return acc;
  }, {});

  const resultsByPlacementId = results.reduce((acc, result) => {
    acc[String(result.placement)] = result;
    return acc;
  }, {});

  const placementStatusCounts = placements.reduce((acc, placement) => {
    const status = String(placement.status || "").toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const totalStudents = students.length;
  const approvedStudents = Object.entries(placementStatusCounts).reduce(
    (count, [status, value]) =>
      approvalStatuses.has(status) ? count + value : count,
    0,
  );
  const activeInternships = Object.entries(placementStatusCounts).reduce(
    (count, [status, value]) =>
      activeStatuses.has(status) ? count + value : count,
    0,
  );
  const pendingPlacements = Object.entries(placementStatusCounts).reduce(
    (count, [status, value]) =>
      pendingStatuses.has(status) ? count + value : count,
    0,
  );

  const totalScore = results.reduce(
    (sum, result) =>
      sum + Number(result.final_score || result.total_score || 0),
    0,
  );
  const averageScore =
    results.length > 0 ? (totalScore / results.length).toFixed(1) : "0.0";

  const tableRows = students.map((student) => {
    const placement = getLatestPlacementForStudent(placements, student);

    const result =
      resultsByPlacementId[String(placement?.id)] ||
      results.find(
        (item) =>
          String(item.student || item.student_id || "") ===
            String(student.id || "") ||
          String(item.student_number || "") ===
            String(student.student_number || ""),
      ) ||
      null;

    const placementStatus = String(
      placement?.status ||
        student.placement_status ||
        student.internship_status ||
        "Pending",
    ).toLowerCase();

    const approvalStatus = approvalStatuses.has(placementStatus)
      ? "Approved"
      : "Pending";
    const score = Number(
      result?.final_score || result?.total_score || student.score || 0,
    );

    return {
      id: student.student_number || student.id || "--",
      name: toDisplayName(student),
      email: student.webmail || student.email || "--",
      programme: getProgrammeName(student, programmeMap),
      placement: getPlacementTitle(placement, student),
      placementStatus: toTitleCase(placementStatus),
      approvalStatus,
      score,
    };
  });

  const filteredStudents = tableRows.filter((student) =>
    [
      student.id,
      student.name,
      student.email,
      student.programme,
      student.placement,
      student.placementStatus,
      student.approvalStatus,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-maroon dark:text-slate-300 sm:text-4xl">
          Student Management
        </h1>
        <p className="text-sm text-text-secondary dark:text-slate-300 sm:text-base lg:text-lg">
          Track student approvals, internship activity, and overall performance
        </p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Approved Students
          </span>
          <span className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            {approvedStudents}
          </span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Active Internships
          </span>
          <span className="text-3xl font-extrabold text-green-500 dark:text-emerald-400">
            {activeInternships}
          </span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Pending Placements
          </span>
          <span className="text-3xl font-extrabold text-orange-500 dark:text-orange-300">
            {pendingPlacements}
          </span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Average Score
          </span>
          <span className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            {averageScore}%
          </span>
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-maroon dark:text-slate-300 mb-1">
              All Students
            </h2>
            <p className="text-text-secondary dark:text-slate-300">
              {loading
                ? "Loading registry and placement records..."
                : `Showing ${filteredStudents.length} of ${totalStudents} registered students`}
            </p>
          </div>
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search students..."
              className="w-full rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold sm:min-w-64"
            />
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        <Table>
          <TableHead>
            <TableRow index={0}>
              <TableHeaderCell>Student ID</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Program</TableHeaderCell>
              <TableHeaderCell>Placement</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Approval</TableHeaderCell>
              <TableHeaderCell>Score</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, idx) => (
                <TableRow key={`${student.id}-${idx}`} index={idx}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-text-primary dark:text-slate-100">
                        {student.name}
                      </div>
                      <div className="text-xs text-text-secondary dark:text-slate-400">
                        {student.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.programme}</TableCell>
                  <TableCell>{student.placement}</TableCell>
                  <TableCell>
                    <StatusBadge status={student.placementStatus} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={
                        approvalStatuses.has(
                          String(student.placementStatus).toLowerCase(),
                        )
                          ? "approved"
                          : "pending"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {student.score > 0 ? (
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {student.score.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-slate-500">
                        --
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      className="hover:text-red-700"
                      variant="ghost"
                      size="sm"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow index={0}>
                <TableCell colSpan={8}>
                  <div className="py-6 text-center text-sm text-text-secondary dark:text-slate-400">
                    {loading
                      ? "Loading students..."
                      : "No students matched the current search."}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default Students;
