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
    setForm({ name: "", type: "", affiliation: "", interns: "", email: "" });
    alert("Supervisor added successfully!");
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
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-maroon dark:text-gold sm:text-4xl">
          Supervisor Management
        </h1>
        <p className="text-sm text-text-secondary dark:text-slate-300 sm:text-base lg:text-lg">
          Manage all supervisors and their assigned interns
        </p>
      </header>
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Total Supervisors
          </span>
          <span className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            10
          </span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Academic Supervisors
          </span>
          <span className="text-3xl font-extrabold text-green-700 dark:text-emerald-400">
            8
          </span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Total Interns Supervised
          </span>
          <span className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            20
          </span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Workplace Supervisors
          </span>
          <span className="text-3xl font-extrabold text-green-700 dark:text-emerald-400">
            18
          </span>
        </div>
      </section>
      <section className="mb-8">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-maroon dark:text-gold mb-1">
              All Supervisors
            </h2>
            <p className="text-text-secondary dark:text-slate-300">
              Complete list of all supervisors
            </p>
          </div>
          <button
            onClick={handleAddSupervisorClick}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-maroonCustom px-5 py-2 font-semibold text-white shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold sm:w-auto"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Supervisor
          </button>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-maroon dark:text-gold mb-4">
                  Add New Supervisor
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="text"
                    placeholder="Type (Academic/Workplace)"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="text"
                    placeholder="Affiliation"
                    name="affiliation"
                    value={form.affiliation}
                    onChange={handleChange}
                    className="border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="number"
                    placeholder="Number of Interns Supervised"
                    name="interns"
                    value={form.interns}
                    onChange={handleChange}
                    className="border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="email"
                    placeholder="Contact Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <Button
                      type="submit"
                      className="bg-maroonCustom text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-300 dark:bg-slate-700 text-black dark:text-slate-100 px-5 py-2 rounded-lg font-semibold shadow hover:bg-gray-400 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
