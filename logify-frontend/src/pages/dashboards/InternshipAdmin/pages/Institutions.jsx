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
    setForm({ name: "", industry: "", email: "" });
    setNotification("Institution added successfully!");
  };
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      {notification && (
        <div className="mb-4 flex flex-col gap-2 rounded border-l-4 border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-3 text-yellow-800 dark:text-yellow-200 sm:flex-row sm:items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
          <span>{notification}</span>
          <button
            onClick={() => setNotification("")}
            className="text-left text-yellow-700 dark:text-yellow-300 hover:underline sm:ml-auto"
          >
            Dismiss
          </button>
        </div>
      )}
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-maroon dark:text-slate-300 sm:text-4xl">
            Partner Institutions
          </h1>
          <p className="text-sm text-text-secondary dark:text-slate-300 sm:text-base lg:text-lg">
            Manage organizations offering internship placements
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <Button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 rounded-lg bg-maroonCustom px-4 py-2 font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button
            onClick={handleAddInstitutionClick}
            className="flex items-center justify-center gap-2 rounded-lg bg-maroonCustom px-5 py-2 font-semibold text-white shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Institution
          </Button>
        </div>
      </header>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search institutions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold md:w-1/3"
        />
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-maroon dark:text-slate-300 mb-4">
              Add New Institution
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Organization Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <input
                type="text"
                placeholder="Industry Type"
                name="industry"
                value={form.industry}
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

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
        <div
          className={`flex cursor-pointer flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8 ${activeStat === "Total Organizations" ? "ring-2 ring-gold" : ""}`}
          onClick={() => handleStatClick("Total Organizations")}
        >
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Total Organizations
          </span>
          <span className="text-3xl font-extrabold text-text-primary dark:text-slate-100">
            {institutions.length}
          </span>
        </div>
        <div
          className={`flex cursor-pointer flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8 ${activeStat === "Active Organizations" ? "ring-2 ring-gold" : ""}`}
          onClick={() => handleStatClick("Active Organizations")}
        >
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Active Organizations
          </span>
          <span className="text-3xl font-extrabold text-text-primary dark:text-slate-100">
            {institutions.length}
          </span>
        </div>
        <div
          className={`flex cursor-pointer flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8 ${activeStat === "Total Interns" ? "ring-2 ring-gold" : ""}`}
          onClick={() => handleStatClick("Total Interns")}
        >
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Total Interns
          </span>
          <span className="text-3xl font-extrabold text-text-primary dark:text-slate-100">
            2
          </span>
        </div>
      </section>
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-maroon dark:text-slate-300 mb-1">
              Organization List
            </h2>
            <p className="text-text-secondary dark:text-slate-300">
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
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewProfile(org)}
                    >
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 text-green-500 dark:text-emerald-400" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {showProfile && selectedInstitution && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-maroon dark:text-gold mb-4">
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
