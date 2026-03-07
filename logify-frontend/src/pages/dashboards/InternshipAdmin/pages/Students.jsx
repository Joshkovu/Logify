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
    <div className="min-h-screen w-full bg-[#FCFBF8] px-10 py-8  font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-maroon mb-2 tracking-tight">
          Student Management
        </h1>
        <p className="text-lg text-text-secondary">
          Overview of student performance and engagement
        </p>
      </header>
      <section className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-surface shadow-md rounded-xl p-6 flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Total Students
          </span>
          <span className="text-3xl font-extrabold text-blue-700">5</span>
        </div>
        <div className="bg-surface shadow-md rounded-xl p-6 flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Active Internships
          </span>
          <span className="text-3xl font-extrabold text-green-500">3</span>
        </div>
        <div className="bg-surface shadow-md rounded-xl p-6 flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Pending Placements
          </span>
          <span className="text-3xl font-extrabold text-orange-300">2</span>
        </div>
        <div className="bg-surface shadow-md rounded-xl p-6 flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Average Score
          </span>
          <span className="text-3xl font-extrabold text-blue-700">84.2%</span>
        </div>
      </section>
      <section>
        <div className="flex mb-6 items-end justify-between">
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
              className="border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold bg-background text-text-primary"
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
