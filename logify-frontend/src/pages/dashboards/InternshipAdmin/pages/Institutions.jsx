import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../../../../components/ui/Button";

const Institutions = () => {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    email: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [institutions, setInstitutions] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddInstitutionClick = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({ name: "", industry: "", email: "" });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    setInstitutions([...institutions, form]);
  };
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
          <Button
            onClick={handleAddInstitutionClick}
            className="bg-maroonCustom flex text-white items-center gap-2 px-5 py-2  rounded-lg font-semibold shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {" "}
            <Plus className="h-4 w-4 mr-2" />
            Add Institution
          </Button>
        </div>
      </header>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-6 bg-white rounded-lg border border-border w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-maroon mb-4">
              Add New Institution
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Organization Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border border-border rounded-lg px-4 py-2 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <input
                type="text"
                placeholder="Industry Type"
                name="industry"
                value={form.industry}
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

      <section className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Total Organizations
          </span>
          <span className="text-3xl font-extrabold text-text-primary">5</span>
        </div>
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Active Organizations
          </span>
          <span className="text-3xl font-extrabold text-text-primary">3</span>
        </div>
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border">
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
