import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { placements } from "./placements-data";
import StatusBadge from "../../../../components/ui/StatusBadge";
import { Button } from "../../../../components/ui/Button";

const stats = [
  { label: "Total Placements", value: 200 },
  { label: "Ongoing Placements", value: 15 },
  { label: "Completed Placements", value: 185 },
  { label: "Average Duration", value: "3 months" },
];

const Placements = () => {
  return (
    <div className="min-h-screen w-full p-4 bg-[#FCFBF8]">
      <h1 className="text-3xl mb-2 font-bold text-brown-800">
        Placement Management
      </h1>
      <p className="text-brown-700">
        Oversee all internship placements and their statuses
      </p>
      <section className="flex mt-4 gap-4 ">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="w-1/4  bg-brown-100  shadow  border-brown-200 bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border"
          >
            <h2 className="text-brown-700 text-lg font-semibold">
              {stat.label}
            </h2>
            <span className="text-2xl font-bold text-green-600">
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
                  <StatusBadge status={placement.status} />
                </TableCell>
                <TableCell>
                  <div className="flex  gap-2">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>

                    <Button variant="ghost" size="sm" className="text-red-600">
                      Override
                    </Button>
                  </div>
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
