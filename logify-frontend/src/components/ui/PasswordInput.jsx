import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import PropTypes from "prop-types";

function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder = "Enter your password",
  error,
  className = "",
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      {label && (
        <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
          {label}
        </label>
      )}
      <div className="relative mt-2">
        <input
          type={isVisible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-border bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800 ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

PasswordInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default PasswordInput;
