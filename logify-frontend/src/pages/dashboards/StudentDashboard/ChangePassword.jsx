import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { api } from "../../../config/api";

const ChangePassword = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onChange = (event) => {
    const { value, name } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("All password fields are required.");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.auth.changePassword({
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      });
      onClose();
      toast.success("Password changed successfully");
    } catch (err) {
      const message = err.message || "Unable to update your password.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed flex inset-0 items-center justify-center z-100 bg-black/50 bg-op px-4 w-full h-full"
      onClick={onClose}
    >
      <div
        className="dark:bg-slate-900 text-sm dark:text-slate-300 relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <p className="dark:text-white font-semibold text-black text-lg">
            Change Password
          </p>
          <p className="dark:text-slate-300 mb-4 text-gray-600">
            Change your password to a new one
          </p>
          <p className="dark:text-white text-black font-semibold">
            Current Password
          </p>
          <input
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={onChange}
            className="mt-2 w-full border border-gray-200 rounded-lg p-1.5"
          />
          <p className="dark:text-white mt-4 text-black font-semibold">
            New Password
          </p>
          <input
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={onChange}
            className="mt-2 w-full border border-gray-200 rounded-lg p-1.5"
          />
          <p className="dark:text-white mt-4 text-black font-semibold">
            Confirm Password
          </p>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={onChange}
            className="mt-2 w-full border border-gray-200 rounded-lg p-1.5"
          />
          {error && <p className="mt-4 text-red-600">{error}</p>}
          <section className="mt-4 w-full flex gap-2 justify-end">
            <button
              type="button"
              className="dark:hover:bg-slate-700 dark:text-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200 rounded-md p-2"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-maroonCustom text-white text-sm font-semibold hover:bg-red-800 transition-colors rounded-md p-2"
            >
              {isSubmitting ? "Updating..." : "Change Password"}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};
ChangePassword.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChangePassword;
