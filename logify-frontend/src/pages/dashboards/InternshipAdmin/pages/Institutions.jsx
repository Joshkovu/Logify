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
    <div className="min-h-screen w-full bg-background px-10 py-8 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-maroon mb-2 tracking-tight">
          Partner Institutions
        </h1>
        <p className="text-lg text-text-secondary">
          Manage organizations offering internship placements
        </p>
      </header>
      <section className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-surface shadow-md rounded-xl p-6 flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Total Organizations
          </span>
          <span className="text-3xl font-extrabold text-text-primary">5</span>
        </div>
        <div className="bg-surface shadow-md rounded-xl p-6 flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Active Organizations
          </span>
          <span className="text-3xl font-extrabold text-text-primary">3</span>
        </div>
        <div className="bg-surface shadow-md rounded-xl p-6 flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Total Interns
          </span>
          <span className="text-3xl font-extrabold text-text-primary">2</span>
        </div>
      </section>
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-maroon mb-1">
              Organization List
            </h2>
            <p className="text-text-secondary">
              Complete list of partner organizations
            </p>
          </div>
          <button className="bg-maroon text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold">
            Add Institution
          </button>
        </div>
        <Table>
          <TableHead>
            <TableRow index={0}>
              <TableHeaderCell>Organization Name</TableHeaderCell>
              <TableHeaderCell>Industry Type</TableHeaderCell>
              <TableHeaderCell>Contact Email</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institutions.map((org, idx) => (
              <TableRow key={idx} index={idx}>
                <TableCell>{org.name}</TableCell>
                <TableCell>{org.industry}</TableCell>
                <TableCell>{org.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default Institutions;
