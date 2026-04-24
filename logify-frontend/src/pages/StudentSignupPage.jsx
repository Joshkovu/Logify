import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";
import { api } from "../config/api.js";

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

  if (!formData.institution) {
    errors.institution = "Institution is required.";
  }

  if (!formData.department) {
    errors.department = "Department is required.";
  }

  if (!formData.programme) {
    errors.programme = "Programme is required.";
  }

  if (!formData.yearOfStudy.trim()) {
    errors.yearOfStudy = "Year of study is required.";
  } else if (!Number.isInteger(Number(formData.yearOfStudy))) {
    errors.yearOfStudy = "Year of study must contain only numbers.";
  } else if (Number(formData.yearOfStudy) > 7) {
    errors.yearOfStudy = "Year of study cannot be longer than 7 years";
  }

  if (!formData.intakeYear.trim()) {
    errors.intakeYear = "Intake year is required.";
  } else if (!Number.isInteger(Number(formData.intakeYear))) {
    errors.intakeYear = "Intake year must contain only numbers.";
  } else if (
    Number(formData.intakeYear) < 1900 ||
    Number(formData.intakeYear) > 2100
  ) {
    errors.intakeYear = "Please enter a valid year.";
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
  const [formData, setFormData] = useState({
    fullName: "",
    webmail: "",
    password: "",
    confirmPassword: "",
    studentNumber: "",
    institution: "",
    department: "",
    programme: "",
    yearOfStudy: "",
    intakeYear: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const data = await api.academics.getInstitutions();
        setInstitutions(data);
      } catch (err) {
        console.error("Failed to fetch institutions:", err);
      }
    };

    fetchInstitutions();
  }, []);

  useEffect(() => {
    if (formData.institution) {
      const fetchDepartments = async () => {
        try {
          const data = await api.academics.getInstitutionDepartments(
            formData.institution,
          );
          setDepartments(data);
          setFormData((current) => ({
            ...current,
            department: "",
            programme: "",
          }));
          setProgrammes([]);
        } catch (err) {
          console.error("Failed to fetch departments:", err);
          setDepartments([]);
        }
      };

      fetchDepartments();
    } else {
      setDepartments([]);
      setProgrammes([]);
    }
  }, [formData.institution]);

  useEffect(() => {
    if (formData.department) {
      const fetchProgrammes = async () => {
        try {
          const data = await api.academics.getDepartmentProgrammes(
            formData.department,
          );
          setProgrammes(data);
          setFormData((current) => ({
            ...current,
            programme: "",
          }));
        } catch (err) {
          console.error("Failed to fetch programmes:", err);
          setProgrammes([]);
        }
      };

      fetchProgrammes();
    } else {
      setProgrammes([]);
    }
  }, [formData.department]);

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
      first_name: firstName,
      last_name: lastName,
      webmail: formData.webmail,
      password: formData.password,
      student_number: Number(formData.studentNumber),
      institution_id: formData.institution,
      programme_id: formData.programme,
      year_of_study: Number(formData.yearOfStudy),
      intake_year: Number(formData.intakeYear),
    };

    setIsSubmitting(true);

    try {
      const response = await studentSignup(payload);
      console.log("Signup successful:", response);
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
              Institution
            </label>
            <select
              name="institution"
              value={formData.institution}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="">Select your Institution</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>
            {fieldErrors.institution && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.institution}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={onChange}
              disabled={!formData.institution}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold disabled:bg-gray-100 disabled:text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:disabled:bg-slate-700"
            >
              <option value="">
                {!formData.institution
                  ? "Select institution first"
                  : "Select your Department"}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {fieldErrors.department && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.department}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Programme
            </label>
            <select
              name="programme"
              value={formData.programme}
              onChange={onChange}
              disabled={!formData.department}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold disabled:bg-gray-100 disabled:text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:disabled:bg-slate-700"
            >
              <option value="">
                {!formData.department
                  ? "Select department first"
                  : "Select your Programme"}
              </option>
              {programmes.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.name}
                </option>
              ))}
            </select>
            {fieldErrors.programme && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.programme}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Year of Study
            </label>
            <input
              name="yearOfStudy"
              value={formData.yearOfStudy}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              placeholder="2"
            />
            {fieldErrors.yearOfStudy && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.yearOfStudy}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-maroon-dark dark:text-gold">
              Intake Year
            </label>
            <input
              name="intakeYear"
              value={formData.intakeYear}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-800"
              placeholder="e.g. 2022"
            />
            {fieldErrors.intakeYear && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.intakeYear}
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
