import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { supervisors } from "./supervisors-data";

const Supervisors = () => {
  return (
    <div className="p-4 min-h-screen w-full">
      <section className="flex">
        <div className="w-1/2">
          <h1>Supervisor Management</h1>
          <p>Manage all supervisors and their assigned interns</p>
        </div>
        <div className="w-1/2 flex justify-end">
          <button className="flex">Add Supervisor</button>
        </div>
      </section>
      <section className=" flex mt-4 gap-4">
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h1>Total Supervisors</h1>
          <span>10</span>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h1>Academic Supervisors</h1>
          <span>8</span>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h1>Total Interns Supervised</h1>
          <span>20</span>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h1>Workplace Supervisors</h1>
          <span>18</span>
        </div>
      </section>
      <section className="mt-4">
        <h1>All Supervisors</h1>
        <p>Complete list of all supervisors</p>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Affiliation</TableHeaderCell>
              <TableHeaderCell>Assigned Interns</TableHeaderCell>
              <TableHeaderCell>Contact Email</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supervisors.map((sup, idx) => (
              <TableRow key={idx}>
                <TableCell>{sup.name}</TableCell>
                <TableCell>{sup.type}</TableCell>
                <TableCell>{sup.affiliation}</TableCell>
                <TableCell>{sup.interns}</TableCell>
                <TableCell>{sup.email}</TableCell>
                <TableCell>
                  <button className="px-3 py-1 bg-brown-600 text-white rounded hover:bg-brown-700 transition">
                    {sup.action}
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

export default Supervisors;
