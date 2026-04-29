import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../../config/api";
import PropTypes from "prop-types";

const CreatePlacement = ({ isOpen, onClose, placement = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    organization: placement?.organization ?? "",
    organization_source: placement?.organization ? "existing" : "new",
    organization_name: "",
    organization_industry: "",
    organization_city: "",
    organization_address: "",
    organization_contact_email: "",
    organization_contact_phone: "",
    internship_title: placement?.internship_title ?? "",
    department_at_company: placement?.department_at_company ?? "",
    work_mode: placement?.work_mode ?? "",
    start_date: placement?.start_date ?? "",
    end_date: placement?.end_date ?? "",
    workplace_supervisor_email: "",
    academic_supervisor_email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState("");
  const [submitAction, setSubmitAction] = useState("draft");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.organization_source === "existing") {
      if (!formData.organization || formData.organization === "")
        return setError("Please select an organization.");
    } else {
      if (!formData.organization_name.trim())
        return setError("Please enter the organization name.");
      if (!formData.organization_industry.trim())
        return setError("Please enter the organization industry.");
      if (!formData.organization_city.trim())
        return setError("Please enter the organization city.");
      if (!formData.organization_address.trim())
        return setError("Please enter the organization address.");
      if (!formData.organization_contact_email.trim())
        return setError("Please enter the organization contact email.");
      if (!formData.organization_contact_phone.trim())
        return setError("Please enter the organization contact phone.");
    }

    if (!formData.internship_title)
      return setError("Please enter an internship title.");
    if (!formData.department_at_company)
      return setError("Please enter a department.");
    if (!formData.work_mode || formData.work_mode === "")
      return setError("Please select a work mode.");
    if (!formData.start_date) return setError("Please select a start date.");
    if (!formData.end_date) return setError("Please select an end date.");
    if (!formData.workplace_supervisor_email.trim())
      return setError("Please enter the workplace supervisor email.");
    if (!formData.academic_supervisor_email.trim())
      return setError("Please enter the academic supervisor email.");

    const payload = {
      internship_title: formData.internship_title.trim(),
      department_at_company: formData.department_at_company.trim(),
      work_mode: formData.work_mode,
      start_date: formData.start_date,
      end_date: formData.end_date,
      workplace_supervisor_email: formData.workplace_supervisor_email.trim(),
      academic_supervisor_email: formData.academic_supervisor_email.trim(),
    };

    if (formData.organization_source === "existing") {
      payload.organization = formData.organization;
    } else {
      payload.organization_details = {
        name: formData.organization_name.trim(),
        industry: formData.organization_industry.trim(),
        city: formData.organization_city.trim(),
        address: formData.organization_address.trim(),
        contact_email: formData.organization_contact_email.trim(),
        contact_phone: formData.organization_contact_phone.trim(),
      };
    }

    setIsSubmitting(true);
    try {
      let result;
      if (placement) {
        result = await api.placements.patchPlacement(placement.id, payload);
      } else {
        result = await api.placements.createPlacement(payload);
      }
      if (submitAction === "submit") {
        await api.placements.submitPlacement(result.id);
      }
      toast.success(
        submitAction === "submit" ? "Placement submitted" : "Placement drafted",
      );
      onSuccess?.();
      onClose();
    } catch (err) {
      const message =
        err.message || "Failed to create placement. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await api.organizations.getOrganizations();
        setOrganizations(data);
        if (!placement) {
          setFormData((current) => ({
            ...current,
            organization_source: data.length > 0 ? "existing" : "new",
          }));
        }
      } catch {
        setOrganizations([]);
      }
    };
    fetchOrganizations();
  }, [placement]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  return (
    <div
      className="fixed flex inset-0 items-center justify-center z-100 bg-black/50 bg-op px-4 w-full h-full"
      onClick={onClose}
    >
      <div
        className="dark:text-white dark:bg-slate-900 text-sm text-gray-600 relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-semibold dark:text-white text-black text-lg">
          {placement
            ? "Edit Internship Placement"
            : "Create Internship Placement"}
        </p>
        <p className="mb-4">
          Add your placement details and assign the correct supervisors
        </p>
        <form onSubmit={onSubmit}>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Organization of internship
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="organization_source"
                  value="existing"
                  checked={formData.organization_source === "existing"}
                  onChange={onChange}
                />
                Existing organization
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="organization_source"
                  value="new"
                  checked={formData.organization_source === "new"}
                  onChange={onChange}
                />
                Create new organization
              </label>
            </div>
            {formData.organization_source === "existing" ? (
              <select
                aria-label="Organization of internship"
                name="organization"
                onChange={onChange}
                value={formData.organization}
                className="w-full border border-gray-200 rounded-lg p-1.5 mt-3"
              >
                <option value="">Select your organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-3 mt-3">
                <input
                  aria-label="Organization Name"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={onChange}
                  placeholder="Organization name"
                  className="w-full border border-gray-200 rounded-lg p-1.5"
                />
                <input
                  aria-label="Industry"
                  name="organization_industry"
                  value={formData.organization_industry}
                  onChange={onChange}
                  placeholder="Industry"
                  className="w-full border border-gray-200 rounded-lg p-1.5"
                />
                <input
                  aria-label="City"
                  name="organization_city"
                  value={formData.organization_city}
                  onChange={onChange}
                  placeholder="City"
                  className="w-full border border-gray-200 rounded-lg p-1.5"
                />
                <input
                  aria-label="Address"
                  name="organization_address"
                  value={formData.organization_address}
                  onChange={onChange}
                  placeholder="Address"
                  className="w-full border border-gray-200 rounded-lg p-1.5"
                />
                <input
                  aria-label="Contact Email"
                  type="email"
                  name="organization_contact_email"
                  value={formData.organization_contact_email}
                  onChange={onChange}
                  placeholder="Contact email"
                  className="w-full border border-gray-200 rounded-lg p-1.5"
                />
                <input
                  aria-label="Contact Phone"
                  name="organization_contact_phone"
                  value={formData.organization_contact_phone}
                  onChange={onChange}
                  placeholder="Contact phone"
                  className="w-full border border-gray-200 rounded-lg p-1.5"
                />
              </div>
            )}
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Internship Title
            </p>
            <input
              aria-label="Internship Title"
              name="internship_title"
              value={formData.internship_title}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg p-1.5"
            ></input>
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Department at Company
            </p>
            <input
              aria-label="Department at Company"
              name="department_at_company"
              value={formData.department_at_company}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg p-1.5"
            ></input>
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Work Mode
            </p>
            <select
              aria-label="Work Mode"
              name="work_mode"
              value={formData.work_mode}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg p-1.5"
            >
              <option value="">Select Work Mode</option>
              <option value="onsite">Onsite</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Start Date
            </p>
            <input
              aria-label="Start Date"
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg p-1.5"
            ></input>
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">End Date</p>
            <input
              aria-label="End Date"
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg p-1.5"
            ></input>
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Workplace Supervisor Email
            </p>
            <input
              aria-label="Workplace Supervisor Email"
              type="email"
              name="workplace_supervisor_email"
              value={formData.workplace_supervisor_email}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg p-1.5"
            ></input>
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Academic Supervisor Email
            </p>
            <input
              aria-label="Academic Supervisor Email"
              type="email"
              name="academic_supervisor_email"
              value={formData.academic_supervisor_email}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg p-1.5"
            ></input>
          </section>
          {error && <p className="my-4 text-red-600">{error}</p>}
          <section className="mt-4 w-full flex gap-2 justify-end">
            <button
              type="button"
              className="dark:text-white dark:hover:bg-slate-700 text-black text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200 rounded-md p-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-maroonCustom text-white text-sm font-semibold hover:bg-red-800 transition-colors rounded-md p-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && submitAction === "draft"
                ? "Saving..."
                : "Save Placement as Draft"}
            </button>
            <button
              className="bg-maroonCustom text-white text-sm font-semibold hover:bg-red-800 transition-colors rounded-md p-2"
              type="submit"
              onClick={() => setSubmitAction("submit")}
              disabled={isSubmitting}
            >
              {isSubmitting && submitAction === "submit"
                ? "Submitting..."
                : "Submit for Review"}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};
CreatePlacement.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  placement: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default CreatePlacement;
