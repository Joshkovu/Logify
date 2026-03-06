import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { students } from "./students-data";

const Students = () => {
  return (
    <div className="min-h-screen w-full ml-4">
      <nav></nav>
      <div className="flex mt-3">
        <div className="w-1/2">
          <h1 className="text-3xl mb-3 ">Student Management</h1>
          <p className="text-xl">
            Overview of student performance and engagement
          </p>
        </div>
        <div className="w-1/2 ">
          <button className="flex bg-gray-500  mb-4 text-white px-4 py-2 rounded">
            Upload CSV
          </button>
          <button className="bg-blue-500 flex text-white px-4 py-2 rounded">
            Generate Report
          </button>
        </div>
      </div>
      <section className="flex mt-4 mb-4">
        <div className="border w-1/4 rounded-e-md bg-zinc-300 border-gray-300 p-3 mr-3">
          <h1>Total Students</h1>
          <span>5</span>
        </div>
        <div className="border w-1/4 rounded-e-md bg-zinc-300 border-gray-300 p-3 mr-3">
          <h1>Active Internships</h1>
          <span>3</span>
        </div>
        <div className="border w-1/4 rounded-e-md bg-zinc-300 border-gray-300 p-3 mr-3">
          <h1>Pending Placements</h1>
          <span>2</span>
        </div>
        <div className="border w-1/4 rounded-e-md bg-zinc-300 border-gray-300 p-3 mr-3">
          <h1>Average Score</h1>
          <span>84.2%</span>
        </div>
      </section>
      <section>
        <div className="flex mb-5">
          <div className="w-1/2">
            <h1>All Students</h1>
            <p>Complete student registry</p>
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Search students..."
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow>
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
              <TableRow key={idx}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.program}</TableCell>
                <TableCell>{student.status}</TableCell>
                <TableCell>{student.score}</TableCell>
                <TableCell>
                  <button className="px-3 py-1 bg-brown-600 text-white rounded hover:bg-brown-700 transition">
                    {student.action}
                  </button>
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
