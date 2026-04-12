import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";

const validateStudentForm = (formData) => {
  const errors = {};
  const trimmedFullName = formData.fullName.trim();
  const nameParts = trimmedFullName.split(/\s+/).filter(Boolean);

  if (!trimmedFullName) {
    errors.fullName = "Full name is required.";
  } else if (nameParts.length < 2) {
    errors.fullName = "Enter both first name and last name.";
  }

  if (!formData.webmail.trim()) {
    errors.webmail = "Email/webmail is required.";
  }

  if (!formData.studentNumber.trim()) {
    errors.studentNumber = "Student number is required.";
  } else if (!Number.isInteger(Number(formData.studentNumber))) {
    errors.studentNumber = "Student number must contain only numbers.";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  } else if (formData.password.length < 8) {
    errors.password = "Password should be more than 8 characters long.";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

const StudentSignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    webmail: "",
    password: "",
    confirmPassword: "",
    studentNumber: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { studentSignup } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = validateStudentForm(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }
    const trimmedFullName = formData.fullName.trim();
    const [firstName, ...rest] = trimmedFullName.split(/\s+/);
    const lastName = rest.join(" ");

    const payload = {
      firstName: firstName,
      lastName: lastName,
      webmail: formData.webmail,
      password: formData.password,
    };

    setIsSubmitting(true);

    try {
      const response = await studentSignup(payload);
      console.log(response);
      navigate("/login", {
        replace: true,
        state: {
          signupSuccess: "Student account created. Please log in.",
        },
      });
    } catch (signupError) {
      setError(signupError.message || "Unable to create student account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  return (
    <GuestOnlyRoute>
      <AuthLayout
        title="Student Signup"
        subtitle="Create a student account for internship logging."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              placeholder="Your full name"
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Institution Webmail
            </label>
            <input
              name="webmail"
              value={formData.webmail}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              placeholder="name@institution.ac.ug"
            />
            {fieldErrors.webmail && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.webmail}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Student Number
            </label>
            <input
              name="studentNumber"
              value={formData.studentNumber}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              placeholder="2500123456"
            />
            {fieldErrors.studentNumber && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.studentNumber}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              placeholder="At least 8 characters"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              placeholder="Re-enter password"
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {error && (
            <div className="my-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-maroonCustom px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Student Account"}
          </button>
        </form>
      </AuthLayout>
    </GuestOnlyRoute>
  );
};

export default StudentSignupPage;
