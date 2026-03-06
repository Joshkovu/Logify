import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { placements } from "./placements-data";

const stats = [
  { label: "Total Placements", value: 200 },
  { label: "Ongoing Placements", value: 15 },
  { label: "Completed Placements", value: 185 },
  { label: "Average Duration", value: "3 months" },
];

const Placements = () => {
  return (
    <div className="min-h-screen w-full p-4 bg-brown-50">
      <h1 className="text-2xl font-bold text-brown-800">
        Placement Management
      </h1>
      <p className="text-brown-700">
        Oversee all internship placements and their statuses
      </p>
      <section className="flex mt-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="w-1/4 p-4 bg-brown-100 rounded-lg shadow border border-brown-200"
          >
            <h2 className="text-brown-700 text-lg font-semibold">
              {stat.label}
            </h2>
            <span className="text-2xl font-bold text-brown-900">
              {stat.value}
            </span>
          </div>
        ))}
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-brown-800 mb-2">
          Recent Placements
        </h2>
        <p className="text-brown-600 mb-4">
          Latest internship placements and their details
        </p>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Student</TableHeaderCell>
              <TableHeaderCell>Organization</TableHeaderCell>
              <TableHeaderCell>Position</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {placements.map((placement, idx) => (
              <TableRow key={idx}>
                <TableCell>{placement.student}</TableCell>
                <TableCell>{placement.organization}</TableCell>
                <TableCell>{placement.position}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${placement.status === "Completed" ? "bg-brown-200 text-brown-800" : "bg-brown-400 text-white"}`}
                  >
                    {placement.status}
                  </span>
                </TableCell>
                <TableCell>
                  <button className="px-3 py-1 bg-brown-600 text-white rounded hover:bg-brown-700 transition">
                    View
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

export default Placements;
