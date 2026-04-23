import { useEffect } from "react";
import PropTypes from "prop-types";
const EditProfile = ({ isOpen, onClose, personalInformation, onUpdate }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const initialFormData = {
    first_name: personalInformation?.first_name || "",
    last_name: personalInformation?.last_name || "",
    email: personalInformation?.email || "",
    student_number: personalInformation?.student_number || "",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = {
      first_name: (data.get("first_name") || "").toString(),
      last_name: (data.get("last_name") || "").toString(),
      email: (data.get("email") || "").toString(),
      student_number: (data.get("student_number") || "").toString(),
    };
    const wasSuccessful = await onUpdate(payload);
    if (wasSuccessful) {
      onClose();
    }
  };

  return (
    <div
      className="fixed flex inset-0 items-center justify-center z-100 bg-black/50 bg-op px-4 w-full h-full"
      onClick={onClose}
    >
      <div
        className="dark:bg-slate-900 text-sm text-gray-600 relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="dark:text-white font-semibold text-black text-lg">
          Edit Profile
        </p>
        <p className="dark:text-white mb-4 text-gray-600">
          Change your profile information
        </p>
        <form onSubmit={handleSubmit}>
          <p className="dark:text-white text-black font-semibold">First Name</p>
          <input
            name="first_name"
            defaultValue={initialFormData.first_name}
            className="mt-2 w-full border border-gray-200 rounded-lg p-1.5"
          />
          <p className="dark:text-white text-black font-semibold">Last Name</p>
          <input
            name="last_name"
            defaultValue={initialFormData.last_name}
            className="mt-2 w-full border border-gray-200 rounded-lg p-1.5"
          />
          <p className="dark:text-white text-black font-semibold">Webmail</p>
          <input
            type="email"
            name="email"
            defaultValue={initialFormData.email}
            className="mt-2 w-full border border-gray-200 rounded-lg p-1.5"
          />
          <p className="dark:text-white text-black font-semibold">
            Student Number
          </p>
          <input
            name="student_number"
            defaultValue={initialFormData.student_number}
            className="mt-2 w-full border border-gray-200 rounded-lg p-1.5"
          />
          <section className="mt-4 w-full flex gap-2 justify-end">
            <button
              type="button"
              className="dark:text-white dark:hover:bg-slate-700 text-black text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200 rounded-md p-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-maroonCustom text-white text-sm font-semibold hover:bg-red-800 transition-colors rounded-md p-2"
            >
              Submit New Information
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};
EditProfile.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  personalInformation: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    student_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

export default EditProfile;
