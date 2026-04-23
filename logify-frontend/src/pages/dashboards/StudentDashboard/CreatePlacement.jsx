import { useEffect, useState } from "react";
import { api } from "../../../config/api";
import PropTypes from "prop-types";

const CreatePlacement = ({ isOpen, onClose, placement = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    organization: placement?.organization ?? "",
    internship_title: placement?.internship_title ?? "",
    department_at_company: placement?.department_at_company ?? "",
    work_mode: placement?.work_mode ?? "",
    start_date: placement?.start_date ?? "",
    end_date: placement?.end_date ?? "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState("");
  const [submitAction, setSubmitAction] = useState("draft");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.organization || formData.organization === "")
      return setError("Please select an organization.");
    if (!formData.internship_title)
      return setError("Please enter an internship title.");
    if (!formData.department_at_company)
      return setError("Please enter a department.");
    if (!formData.work_mode || formData.work_mode === "")
      return setError("Please select a work mode.");
    if (!formData.start_date) return setError("Please select a start date.");
    if (!formData.end_date) return setError("Please select an end date.");

    const payload = {
      organization: formData.organization,
      internship_title: formData.internship_title.trim(),
      department_at_company: formData.department_at_company.trim(),
      work_mode: formData.work_mode,
      start_date: formData.start_date,
      end_date: formData.end_date,
    };

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
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create placement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await api.organizations.getOrganizations();
        setOrganizations(data);
      } catch {
        setOrganizations([]);
      }
    };
    fetchOrganizations();
  }, []);

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
          Create Internship Placement
        </p>
        <p className="mb-4">
          Create a placement to begin your internship journey
        </p>
        <form onSubmit={onSubmit}>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Organization of internship
            </p>
            <select
              name="organization"
              onChange={onChange}
              value={formData.organization}
              className="w-full border border-gray-200 rounded-lg p-1.5"
            >
              <option value="">Select your organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </section>
          <section className="mt-4">
            <p className="dark:text-white text-black font-semibold">
              Internsip Title
            </p>
            <input
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
              type="date"
              name="end_date"
              value={formData.end_date}
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
