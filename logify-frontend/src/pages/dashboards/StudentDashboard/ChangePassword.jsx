import { useEffect } from "react";
import PropTypes from "prop-types";
const ChangePassword = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed flex inset-0 items-center justify-center z-100 bg-black/50 bg-op px-4 w-full h-full"
      onClick={onClose}
    >
      <div
        className="text-sm text-gray-600 relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-semibold text-black text-lg">Change Password</p>
        <p className="mb-4 text-gray-600">Change your password to a new one</p>
        <p className="text-black font-semibold">Old Password</p>
        <input
          type="password"
          className="mt-2 w-full border border-gray-200 rounded-lg p-1.5"
        />
        <p className="text-black font-semibold">New Password</p>
        <input
          type="password"
          className="mt-2 w-full border border-gray-200 rounded-lg p-1.5"
        />
        <section className="mt-4 w-full flex gap-2 justify-end">
          <button
            className="text-black text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200 rounded-md p-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-maroonCustom text-white text-sm font-semibold hover:bg-red-800 transition-colors rounded-md p-2"
            onClick={onClose}
          >
            Change Password
          </button>
        </section>
      </div>
    </div>
  );
};
ChangePassword.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChangePassword;
