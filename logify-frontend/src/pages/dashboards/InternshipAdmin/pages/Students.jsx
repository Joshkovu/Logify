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

const approvalStatuses = new Set(["approved", "active", "completed"]);
const activeStatuses = new Set(["active"]);
const pendingStatuses = new Set(["draft", "submitted", "pending"]);

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      const [
        studentsResult,
        programmesResult,
        placementsResult,
        resultsResult,
      ] = await Promise.allSettled([
        api.registry.getStudents(),
        api.academics.getProgrammes(),
        api.placements.getPlacements(),
        api.evaluations.getResults(),
      ]);

      if (!isMounted) return;

      if (studentsResult.status === "fulfilled") {
        setStudents(normalizeCollection(studentsResult.value, "students"));
      } else {
        setStudents([]);
      }

      if (programmesResult.status === "fulfilled") {
        setProgrammes(
          normalizeCollection(programmesResult.value, "programmes"),
        );
      } else {
        setProgrammes([]);
      }

      if (placementsResult.status === "fulfilled") {
        setPlacements(
          normalizeCollection(placementsResult.value, "placements"),
        );
      } else {
        setPlacements([]);
      }

      if (resultsResult.status === "fulfilled") {
        setResults(normalizeCollection(resultsResult.value, "results"));
      } else {
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
      }

      setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const programmeMap = programmes.reduce((acc, programme) => {
    acc[String(programme.id)] = programme.name;
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
    const placement =
      placements.find((item) => {
        const placementId = String(item.id);
        const studentPlacementId = String(
          student.placement_id || student.placement || "",
        );
        const itemStudentNumber = String(
          item.student_number || item.intern_student_number || "",
        );
        return (
          (studentPlacementId && placementId === studentPlacementId) ||
          (itemStudentNumber &&
            itemStudentNumber === String(student.student_number || ""))
        );
      }) || null;

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

    const placementStatus =
      placement?.status ||
      student.placement_status ||
      student.internship_status ||
      "Pending";
    const approvalStatus = approvalStatuses.has(
      String(placementStatus).toLowerCase(),
    )
      ? "Approved"
      : "Pending";
    const score = Number(
      result?.final_score || result?.total_score || student.score || 0,
    );

    return {
      id: student.student_number || student.id || "--",
      name: toDisplayName(student),
      email: student.webmail || student.email || "--",
      programme:
        student.programme_name ||
        programmeMap[String(student.programme)] ||
        "Programme not set",
      placement:
        placement?.internship_title ||
        student.internship_title ||
        student.organization_name ||
        "--",
      placementStatus: toTitleCase(String(placementStatus || "Pending")),
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
                    <StatusBadge status={student.approvalStatus} />
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
