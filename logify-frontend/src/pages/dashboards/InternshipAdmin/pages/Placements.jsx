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
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <h1 className="mb-2 text-3xl font-extrabold text-brown-800 dark:text-gold sm:text-4xl">
        Placement Management
      </h1>
      <p className="text-sm text-brown-700 dark:text-slate-200 sm:text-base lg:text-lg">
        Oversee all internship placements and their statuses
      </p>
      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow transition-all hover:scale-102 sm:p-8"
          >
            <h2 className="text-brown-700 dark:text-slate-200 text-lg font-semibold">
              {stat.label}
            </h2>
            <span className="text-2xl font-bold text-green-600 dark:text-emerald-400">
              {stat.value}
            </span>
          </div>
        ))}
      </section>
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brown-800 dark:text-gold mb-2">
          Recent Placements
        </h2>
        <p className="text-brown-600 dark:text-slate-300 mb-4">
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
