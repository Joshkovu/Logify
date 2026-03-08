import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Download, AlertTriangle } from "lucide-react";
import { Button } from "../../../../components/ui/Button";

const Institutions = () => {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    email: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [notification, setNotification] = useState("");

  const filteredInstitutions = institutions.filter(
    (org) =>
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.industry.toLowerCase().includes(search.toLowerCase()) ||
      org.email.toLowerCase().includes(search.toLowerCase()),
  );

  const [activeStat, setActiveStat] = useState(null);
  const handleStatClick = (stat) => {
    setActiveStat(stat);

    setNotification(`Filtered by ${stat}`);
  };

  const handleExport = () => {
    setNotification("Exported institutions as CSV!");
  };

  const handleViewProfile = (org) => {
    setSelectedInstitution(org);
    setShowProfile(true);
  };
  const handleCloseProfile = () => {
    setShowProfile(false);
    setSelectedInstitution(null);
  };

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
      {notification && (
        <div className="mb-4 flex items-center gap-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-4 py-2 rounded">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <span>{notification}</span>
          <button
            onClick={() => setNotification("")}
            className="ml-auto text-yellow-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
      <header className="mb-8 flex flex-col md:flex-row justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-4xl font-extrabold text-maroon mb-2 tracking-tight">
            Partner Institutions
          </h1>
          <p className="text-lg text-text-secondary">
            Manage organizations offering internship placements
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            onClick={handleExport}
            className="bg-gold text-maroon font-semibold flex items-center gap-2 px-4 py-2 rounded-lg shadow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button
            onClick={handleAddInstitutionClick}
            className="bg-maroonCustom flex text-white items-center gap-2 px-5 py-2  rounded-lg font-semibold shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Institution
          </Button>
        </div>
      </header>

      <div className="mb-6 flex flex-col md:flex-row gap-3 md:gap-0 md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search institutions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-border rounded-lg px-4 py-2 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-gold w-full md:w-1/3"
        />
      </div>
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

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className={`bg-white rounded-[12px] p-10 hover:scale-102 transition-all flex flex-col items-center border border-border cursor-pointer ${activeStat === "Total Organizations" ? "ring-2 ring-gold" : ""}`}
          onClick={() => handleStatClick("Total Organizations")}
        >
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Total Organizations
          </span>
          <span className="text-3xl font-extrabold text-text-primary">
            {institutions.length}
          </span>
        </div>
        <div
          className={`bg-white rounded-[12px] p-10 hover:scale-102 transition-all flex flex-col items-center border border-border cursor-pointer ${activeStat === "Active Organizations" ? "ring-2 ring-gold" : ""}`}
          onClick={() => handleStatClick("Active Organizations")}
        >
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Active Organizations
          </span>
          <span className="text-3xl font-extrabold text-text-primary">
            {institutions.length}
          </span>
        </div>
        <div
          className={`bg-white rounded-[12px] p-10 hover:scale-102 transition-all flex flex-col items-center border border-border cursor-pointer ${activeStat === "Total Interns" ? "ring-2 ring-gold" : ""}`}
          onClick={() => handleStatClick("Total Interns")}
        >
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
            {filteredInstitutions.map((org, idx) => (
              <TableRow key={idx} index={idx}>
                <TableCell>{org.name}</TableCell>
                <TableCell>{org.industry}</TableCell>
                <TableCell>{org.email}</TableCell>
                <div className="flex">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewProfile(org)}
                    >
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                  </TableCell>
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

        {showProfile && selectedInstitution && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="p-6 bg-white rounded-lg border border-border w-full max-w-md shadow-lg">
              <h2 className="text-2xl font-bold text-maroon mb-4">
                Institution Profile
              </h2>
              <div className="mb-2">
                <span className="font-semibold">Name:</span>{" "}
                {selectedInstitution.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Industry:</span>{" "}
                {selectedInstitution.industry}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Email:</span>{" "}
                {selectedInstitution.email}
              </div>
              <Button
                onClick={handleCloseProfile}
                className="mt-4 bg-maroonCustom text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Institutions;
