import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import StatusBadge from "../../../../components/ui/StatusBadge";
import { students } from "./students-data";
import { Button } from "../../../../components/ui/Button";

const Students = () => {
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-maroon sm:text-4xl">
          Student Management
        </h1>
        <p className="text-sm text-text-secondary sm:text-base lg:text-lg">
          Overview of student performance and engagement
        </p>
      </header>
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        <div className="flex flex-col items-center rounded-[12px] border border-border bg-white p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Total Students
          </span>
          <span className="text-3xl font-extrabold text-blue-700">5</span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border bg-white p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Active Internships
          </span>
          <span className="text-3xl font-extrabold text-green-500">3</span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border bg-white p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Pending Placements
          </span>
          <span className="text-3xl font-extrabold text-orange-300">2</span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border bg-white p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Average Score
          </span>
          <span className="text-3xl font-extrabold text-blue-700">84.2%</span>
        </div>
      </section>
      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-maroon mb-1">
              All Students
            </h2>
            <p className="text-text-secondary">Complete student registry</p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search students..."
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-gold sm:min-w-64"
            />
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow index={0}>
              <TableHeaderCell>Student ID</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Program</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Score</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, idx) => (
              <TableRow key={idx} index={idx}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.program}</TableCell>
                <TableCell>
                  <StatusBadge status={student.status} />
                </TableCell>
                <TableCell>
                  {student.score ? (
                    <span className="font-medium text-blue-600">
                      {student.score}%
                    </span>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    className="hover:text-red-700"
                    variant="ghost"
                    size="sm"
                  >
                    {student.action}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default Students;
