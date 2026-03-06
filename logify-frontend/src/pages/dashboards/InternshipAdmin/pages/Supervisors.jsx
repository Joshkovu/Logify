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
    <div className="min-h-screen w-full bg-background px-10 py-8  font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-maroon mb-2 tracking-tight">
          Supervisor Management
        </h1>
        <p className="text-lg text-text-secondary">
          Manage all supervisors and their assigned interns
        </p>
      </header>
      <section className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-surface shadow-md rounded-xl p-6 flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Total Supervisors
          </span>
          <span className="text-3xl font-extrabold text-text-primary">10</span>
        </div>
        <div className="bg-surface shadow-md rounded-xl p-6 flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Academic Supervisors
          </span>
          <span className="text-3xl font-extrabold text-text-primary">8</span>
        </div>
        <div className="bg-surface shadow-md rounded-xl p-6 flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Total Interns Supervised
          </span>
          <span className="text-3xl font-extrabold text-text-primary">20</span>
        </div>
        <div className="bg-surface shadow-md rounded-xl p-6 flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Workplace Supervisors
          </span>
          <span className="text-3xl font-extrabold text-text-primary">18</span>
        </div>
      </section>
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-maroon mb-1">
              All Supervisors
            </h2>
            <p className="text-text-secondary">
              Complete list of all supervisors
            </p>
          </div>
          <button className="bg-maroon text-black px-5 py-2 rounded-lg font-semibold shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold">
            Add Supervisor
          </button>
        </div>
        <Table>
          <TableHead>
            <TableRow index={0}>
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
              <TableRow key={idx} index={idx}>
                <TableCell>{sup.name}</TableCell>
                <TableCell>{sup.type}</TableCell>
                <TableCell>{sup.affiliation}</TableCell>
                <TableCell>{sup.interns}</TableCell>
                <TableCell>{sup.email}</TableCell>
                <TableCell>
                  <button className="bg-maroon text-white px-3 py-1 rounded-lg font-semibold shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold">
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
