import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { institutions } from "./institutions-data";

const Institutions = () => {
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8]  px-10 py-8 font-sans">
      <header className="mb-8 flex justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-maroon mb-2 tracking-tight">
            Partner Institutions
          </h1>
          <p className="text-lg text-text-secondary">
            Manage organizations offering internship placements
          </p>
        </div>
        <div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            {" "}
            <Plus className="h-4 w-4 mr-2" />
            Add Institution
          </Button>
        </div>
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
        </div>
        <Table>
          <TableHead>
            <TableRow index={0}>
              <TableHeaderCell>Organization Name</TableHeaderCell>
              <TableHeaderCell>Industry Type</TableHeaderCell>
              <TableHeaderCell>Contact Email</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institutions.map((org, idx) => (
              <TableRow key={idx} index={idx}>
                <TableCell>{org.name}</TableCell>
                <TableCell>{org.industry}</TableCell>
                <TableCell>{org.email}</TableCell>
                <div className="flex">
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 text-green-500" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </div>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default Institutions;
