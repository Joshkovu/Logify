import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { institutions } from "./institutions-data";

const Institutions = () => {
  return (
    <div className="min-h-screen w-full ml-4">
      <nav></nav>
      <section className="flex">
        <div className="w-1/2">
          <h1 className="text-2xl mb-2">Partner Institutions</h1>
          <p className="text-xl mb-3">
            Manage organizations offering internship placements
          </p>
        </div>
        <div className="w-1/2">
          <button className="flex border mt-4 border-gray-300  bg-blue-500 rounded px-4 py-2">
            Add Institution
          </button>
        </div>
      </section>
      <section className="flex mt-2 mb-3">
        <div className=" p-4 mr-3 bg-gray-100 rounded-lg shadow-md">
          <h1>Total Organizations</h1>
          <span>5</span>
        </div>
        <div className=" p-4 mr-3 bg-gray-100 rounded-lg shadow-md">
          <h1>Active Organizations</h1>
          <span>3</span>
        </div>
        <div className=" p-4  bg-gray-100 rounded-lg shadow-md">
          <h1>Total Interns</h1>
          <span>2</span>
        </div>
      </section>
      <main>
        <h2 className="text-xl font-bold mb-4">Organization List</h2>
        <p className="mb-3">Complete list of partner organizations</p>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Organization Name</TableHeaderCell>
              <TableHeaderCell>Industry Type</TableHeaderCell>
              <TableHeaderCell>Contact Email</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institutions.map((org, idx) => (
              <TableRow key={idx}>
                <TableCell>{org.name}</TableCell>
                <TableCell>{org.industry}</TableCell>
                <TableCell>{org.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
};

export default Institutions;
