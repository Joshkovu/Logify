import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { Plus, Edit, Trash2, Eye, Download, AlertTriangle } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { api } from "../../../../config/api";

const emptyForm = {
  name: "",
  industry: "",
  city: "",
  address: "",
  contact_email: "",
  contact_phone: "",
};

const normalizeCollection = (payload, key) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const toCsvValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const Institutions = () => {
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [notification, setNotification] = useState("");
  const [activeStat, setActiveStat] = useState("Total Organizations");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");

    const [organizationsResult, placementsResult] = await Promise.allSettled([
      api.organizations.getOrganizations(),
      api.placements.getPlacements(),
    ]);

    setOrganizations(
      organizationsResult.status === "fulfilled"
        ? normalizeCollection(organizationsResult.value, "organizations")
        : [],
    );
    setPlacements(
      placementsResult.status === "fulfilled"
        ? normalizeCollection(placementsResult.value, "placements")
        : [],
    );

    if (
      organizationsResult.status === "rejected" &&
      placementsResult.status === "rejected"
    ) {
      setError("Unable to load partner organizations right now.");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const placementCounts = placements.reduce((acc, placement) => {
    const key = String(placement.organization || "");
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const activeOrganizationIds = new Set(
    placements
      .filter((placement) =>
        ["approved", "active"].includes(String(placement.status).toLowerCase()),
      )
      .map((placement) => String(placement.organization || "")),
  );

  const filteredBySearch = organizations.filter((org) =>
    [
      org.name,
      org.industry,
      org.contact_email,
      org.contact_phone,
      org.city,
      org.address,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const filteredInstitutions = filteredBySearch.filter((org) => {
    if (activeStat === "Active Organizations") {
      return activeOrganizationIds.has(String(org.id));
    }

    if (activeStat === "Total Interns") {
      return (placementCounts[String(org.id)] || 0) > 0;
    }

    return true;
  });

  const handleStatClick = (stat) => {
    setActiveStat(stat);
    setNotification(`Filtered by ${stat}`);
  };

  const handleExport = () => {
    const csv = [
      [
        "Organization Name",
        "Industry",
        "City",
        "Address",
        "Contact Email",
        "Contact Phone",
        "Placements",
      ]
        .map(toCsvValue)
        .join(","),
      ...filteredInstitutions.map((org) =>
        [
          org.name,
          org.industry,
          org.city,
          org.address,
          org.contact_email,
          org.contact_phone,
          placementCounts[String(org.id)] || 0,
        ]
          .map(toCsvValue)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "partner-organizations.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotification("Exported organizations as CSV.");
  };

  const handleViewProfile = (org) => {
    setSelectedInstitution(org);
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setSelectedInstitution(null);
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddInstitutionClick = () => {
    setEditingInstitution(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleEditInstitution = (org) => {
    setEditingInstitution(org);
    setForm({
      name: org.name || "",
      industry: org.industry || "",
      city: org.city || "",
      address: org.address || "",
      contact_email: org.contact_email || "",
      contact_phone: org.contact_phone || "",
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingInstitution(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingInstitution) {
        await api.organizations.updateOrganization(editingInstitution.id, form);
        setNotification("Institution updated successfully.");
      } else {
        await api.organizations.createOrganization(form);
        setNotification("Institution added successfully.");
      }

      setShowForm(false);
      setEditingInstitution(null);
      setForm(emptyForm);
      await loadData();
    } catch (submitError) {
      setError(submitError.message || "Unable to save institution.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (org) => {
    setDeletingId(org.id);
    setError("");

    try {
      await api.organizations.deleteOrganization(org.id);
      setNotification(`${org.name} deleted successfully.`);
      if (selectedInstitution?.id === org.id) {
        handleCloseProfile();
      }
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete institution.");
    } finally {
      setDeletingId(null);
    }
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
            disabled={filteredInstitutions.length === 0}
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

      {error ? (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search institutions..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold md:w-1/3"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-maroon dark:text-slate-300 mb-4">
              {editingInstitution ? "Edit Institution" : "Add New Institution"}
            </h2>
            <form
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Organization Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <input
                type="text"
                placeholder="Industry Type"
                name="industry"
                value={form.industry}
                onChange={handleChange}
                required
                className="border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <input
                type="text"
                placeholder="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <input
                type="text"
                placeholder="Contact Phone"
                name="contact_phone"
                value={form.contact_phone}
                onChange={handleChange}
                required
                className="border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <input
                type="email"
                placeholder="Contact Email"
                name="contact_email"
                value={form.contact_email}
                onChange={handleChange}
                required
                className="border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold sm:col-span-2"
              />
              <textarea
                placeholder="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows={3}
                className="border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold sm:col-span-2"
              />
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:gap-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-maroonCustom text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {submitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="px-5 py-2 rounded-lg font-semibold shadow"
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
            {loading ? "..." : organizations.length}
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
            {loading ? "..." : activeOrganizationIds.size}
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
            {loading ? "..." : placements.length}
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
              {loading
                ? "Loading partner organizations..."
                : `Showing ${filteredInstitutions.length} of ${organizations.length} organizations`}
            </p>
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow index={0}>
              <TableHeaderCell>Organization Name</TableHeaderCell>
              <TableHeaderCell>Industry Type</TableHeaderCell>
              <TableHeaderCell>Location</TableHeaderCell>
              <TableHeaderCell>Contact</TableHeaderCell>
              <TableHeaderCell>Placements</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInstitutions.length > 0 ? (
              filteredInstitutions.map((org, idx) => (
                <TableRow key={org.id} index={idx}>
                  <TableCell>{org.name}</TableCell>
                  <TableCell>{org.industry}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{org.city}</div>
                      <div className="text-xs text-text-secondary dark:text-slate-400">
                        {org.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{org.contact_email}</div>
                      <div className="text-xs text-text-secondary dark:text-slate-400">
                        {org.contact_phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{placementCounts[String(org.id)] || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewProfile(org)}
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditInstitution(org)}
                      >
                        <Edit className="h-4 w-4 text-green-500 dark:text-emerald-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(org)}
                        disabled={deletingId === org.id}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow index={0}>
                <TableCell colSpan={6}>
                  <div className="py-6 text-center text-sm text-text-secondary dark:text-slate-400">
                    {loading
                      ? "Loading organizations..."
                      : "No organizations matched the current filters."}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {showProfile && selectedInstitution && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-maroon dark:text-gold mb-4">
                Institution Profile
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedInstitution.name}
                </div>
                <div>
                  <span className="font-semibold">Industry:</span>{" "}
                  {selectedInstitution.industry}
                </div>
                <div>
                  <span className="font-semibold">City:</span>{" "}
                  {selectedInstitution.city}
                </div>
                <div>
                  <span className="font-semibold">Phone:</span>{" "}
                  {selectedInstitution.contact_phone}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedInstitution.contact_email}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold">Address:</span>{" "}
                  {selectedInstitution.address}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold">Placements:</span>{" "}
                  {placementCounts[String(selectedInstitution.id)] || 0}
                </div>
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
