import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { useState } from "react";

import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { UserPlus } from "lucide-react";

const Supervisors = () => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    affiliation: "",
    interns: "",
    email: "",
  });
  const [supervisors, setSupervisors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleAddSupervisorClick = () => {
    setShowForm(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    setSupervisors([...supervisors, form]);
  };
  const handleCancel = () => {
    setShowForm(false);
    setForm({
      name: "",
      type: "",
      affiliation: "",
      interns: "",
      email: "",
    });
  };
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-10 py-8  font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-maroon mb-2 tracking-tight">
          Supervisor Management
        </h1>
        <p className="text-lg text-text-secondary">
          Manage all supervisors and their assigned interns
        </p>
      </header>
      <section className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Total Supervisors
          </span>
          <span className="text-3xl font-extrabold text-blue-700">10</span>
        </div>
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Academic Supervisors
          </span>
          <span className="text-3xl font-extrabold text-green-700">8</span>
        </div>
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Total Interns Supervised
          </span>
          <span className="text-3xl font-extrabold text-blue-700">20</span>
        </div>
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Workplace Supervisors
          </span>
          <span className="text-3xl font-extrabold text-green-700">18</span>
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
          <button
            onClick={handleAddSupervisorClick}
            className="bg-maroonCustom flex text-white items-center gap-2 px-5 py-2  rounded-lg font-semibold shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Supervisor
          </button>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="p-6 bg-white rounded-lg border border-border w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-bold text-maroon mb-4">
                  Add New Supervisor
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border border-border rounded-lg px-4 py-2 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="text"
                    placeholder="Type (Academic/Workplace)"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="border border-border rounded-lg px-4 py-2 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="text"
                    placeholder="Affiliation"
                    name="affiliation"
                    value={form.affiliation}
                    onChange={handleChange}
                    className="border border-border rounded-lg px-4 py-2 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="number"
                    placeholder="Number of Interns Supervised"
                    name="interns"
                    value={form.interns}
                    onChange={handleChange}
                    className="border border-border rounded-lg px-4 py-2 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="email"
                    placeholder="Contact Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="border border-border rounded-lg px-4 py-2 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="bg-maroonCustom text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-300 text-black px-5 py-2 rounded-lg font-semibold shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
                <TableCell>
                  {" "}
                  <Badge
                    variant={sup.type === "Academic" ? "default" : "outline"}
                  >
                    {sup.type}
                  </Badge>
                </TableCell>
                <TableCell>{sup.affiliation}</TableCell>
                <TableCell>{sup.interns}</TableCell>
                <TableCell>{sup.email}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
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
export default Supervisors;
