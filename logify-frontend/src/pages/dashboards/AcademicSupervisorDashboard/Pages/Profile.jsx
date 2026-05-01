import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "../../../../components/ui/ThemeToggle";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Award,
  Calendar,
  GraduationCap,
  ShieldCheck,
  Settings,
  Key,
  X,
  Save,
  Lock,
} from "lucide-react";
import {
  getUserDisplayName,
  loadAcademicSupervisorData,
} from "../utils/academicSupervisorData";
import { toast } from "react-toastify";
import { api } from "../../../../config/api";

const Profile = () => {
  const [isDark] = useState(() => localStorage.getItem("logify-theme") === "dark");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    officePhone: "",
    university: "",
    department: "",
    position: "",
    officeLocation: "",
    specialization: "",
    yearsAtUniversity: "",
  });
  const [stats, setStats] = useState([
    { value: "0", label: "Current Interns" },
    { value: "0", label: "Total Students" },
    { value: "0%", label: "Average Score" },
    { value: "0%", label: "Completion Rate" },
  ]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("logify-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("logify-theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await loadAcademicSupervisorData();
        const me = data.me;
        const averageScore =
          data.results.length === 0
            ? 0
            : Math.round(
                data.results.reduce(
                  (total, result) => total + Number(result.final_score || 0),
                  0,
                ) / data.results.length,
              );
        const completionRate =
          data.placements.length === 0
            ? 0
            : Math.round(
                (data.placements.filter(
                  (placement) => placement.status === "completed",
                ).length /
                  data.placements.length) *
                  100,
              );

        const nextProfile = {
          firstName: me?.first_name || "",
          lastName: me?.last_name || "",
          email: me?.email || "",
          officePhone: me?.phone || "",
          university: me?.institution_id || "Unavailable",
          department: me?.staff_profile?.department_name || "Unavailable",
          position: me?.staff_profile?.title || "Academic Supervisor",
          officeLocation: "Unavailable",
          specialization: "Unavailable",
          yearsAtUniversity: "Unavailable",
        };

        setProfile(nextProfile);
        setEditForm(nextProfile);
        setStats([
          {
            value: String(data.placements.length),
            label: "Current Interns",
          },
          {
            value: String(data.placements.length),
            label: "Total Students",
          },
          {
            value: `${averageScore}%`,
            label: "Average Score",
          },
          {
            value: `${completionRate}%`,
            label: "Completion Rate",
          },
        ]);
      } catch (loadError) {
        setError(loadError.message || "Unable to load your profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const sectionCardClassName =
    "rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:scale-[1.005] sm:p-6 lg:p-8";

  const personalInfo = useMemo(
    () => [
      {
        label: "First Name",
        value: profile.firstName || "Unavailable",
        icon: <User size={16} />,
      },
      {
        label: "Last Name",
        value: profile.lastName || "Unavailable",
        icon: <User size={16} />,
      },
      {
        label: "Email Address",
        value: profile.email || "Unavailable",
        icon: <Mail size={16} />,
      },
      {
        label: "Office Phone",
        value: profile.officePhone || "Unavailable",
        icon: <Phone size={16} />,
      },
    ],
    [profile],
  );

  const academicInfo = useMemo(
    () => [
      {
        label: "University",
        value: profile.university || "Unavailable",
        icon: <GraduationCap size={16} />,
      },
      {
        label: "Department",
        value: profile.department || "Unavailable",
        icon: <Building2 size={16} />,
      },
      {
        label: "Position",
        value: profile.position || "Unavailable",
        icon: <Award size={16} />,
      },
      {
        label: "Office Location",
        value: profile.officeLocation || "Unavailable",
        icon: <MapPin size={16} />,
      },
      {
        label: "Specialization",
        value: profile.specialization || "Unavailable",
        icon: <ShieldCheck size={16} />,
      },
      {
        label: "Years at University",
        value: profile.yearsAtUniversity || "Unavailable",
        icon: <Calendar size={16} />,
      },
    ],
    [profile],
  );

  const handleOpenEditModal = () => {
    setEditForm(profile);
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    const saveProfile = async () => {
      setError("");

      if (
        !editForm.firstName.trim() ||
        !editForm.lastName.trim() ||
        !editForm.email.trim()
      ) {
        setError("First name, last name, and email are required.");
        return;
      }

      setIsSavingProfile(true);
      try {
        const updated = await api.auth.updateMe({
          first_name: editForm.firstName.trim(),
          last_name: editForm.lastName.trim(),
          email: editForm.email.trim(),
          phone: editForm.officePhone.trim(),
          title: editForm.position.trim(),
        });

        setProfile((current) => ({
          ...current,
          firstName: updated.first_name || current.firstName,
          lastName: updated.last_name || current.lastName,
          email: updated.email || current.email,
          officePhone: updated.phone || "",
          position: updated.staff_profile?.title || editForm.position.trim(),
          department:
            updated.staff_profile?.department_name || current.department,
        }));
        setShowEditModal(false);
        toast.success("Profile updated successfully");
      } catch (saveError) {
        const message = saveError.message || "Unable to update your profile.";
        setError(message);
        toast.error(message);
      } finally {
        setIsSavingProfile(false);
      }
    };

    saveProfile();
  };

  const handlePasswordChange = () => {
    const changePassword = async () => {
      if (
        !passwordForm.currentPassword ||
        !passwordForm.newPassword ||
        !passwordForm.confirmPassword
      ) {
        setError("Please fill in all password fields.");
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }

      if (passwordForm.newPassword.length < 8) {
        setError("New password must be at least 8 characters long.");
        return;
      }

      setIsUpdatingPassword(true);
      setError("");
      try {
        await api.auth.changePassword({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
        });
        setShowSecurityModal(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Password changed successfully");
      } catch (passwordError) {
        const message = passwordError.message || "Unable to update password.";
        setError(message);
        toast.error(message);
      } finally {
        setIsUpdatingPassword(false);
      }
    };

    changePassword();
  };

  const handleEditInputChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const initials = getUserDisplayName(
    { first_name: profile.firstName, last_name: profile.lastName },
    "ER",
  )
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mb-5 -mx-4 flex items-center justify-between border-b border-border px-4 pb-1.5 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 xl:-mx-12 xl:px-12">
        <h1 className="text-sm font-bold uppercase tracking-[0.18em] text-black/70 dark:text-slate-300 sm:text-base">
          LOGIFY ACADEMIC SUPERVISOR
        </h1>

        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-4xl">
        <header className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="mb-3 text-3xl font-black tracking-tighter text-maroon-dark dark:text-white sm:text-4xl lg:text-5xl">
            My <span className="text-gold">Profile</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary/80 dark:text-slate-300 sm:text-base lg:text-lg">
            Manage your professional identity and academic credentials within
            the Logify ecosystem.
          </p>
          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </p>
          )}
        </header>

        <div className="space-y-6">
          <div className="rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:scale-[1.005] sm:p-6 lg:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#7A1C1C] text-xl font-black text-white shadow-sm">
                  {isLoading ? "..." : initials}
                </div>

                <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-maroon-dark transition-colors hover:text-gold dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                  <Settings size={14} />
                </button>
              </div>

              <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white sm:text-2xl">
                {isLoading
                  ? "Loading profile..."
                  : `${profile.position === "Academic Supervisor" ? "" : `${profile.position} `}${profile.firstName} ${profile.lastName}`.trim()}
              </h2>

              <p className="mt-2 rounded-full bg-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gold dark:text-slate-300">
                Academic Supervisor
              </p>

              <p className="mt-2 text-sm text-text-secondary dark:text-slate-300">
                Department of {profile.department || "Unavailable"}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/40 bg-background dark:border-slate-700/30 dark:bg-slate-800/50 p-3 text-center">
                <p className="text-xl font-black text-maroon-dark dark:text-white">
                  {stats[0].value}
                </p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary/50 dark:text-slate-400">
                  {stats[0].label}
                </p>
              </div>

              <div className="rounded-xl border border-border/40 bg-background dark:border-slate-700/30 dark:bg-slate-800/50 p-3 text-center">
                <p className="text-xl font-black text-maroon-dark dark:text-white">
                  {stats[1].value}
                </p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary/50 dark:text-slate-400">
                  {stats[1].label}
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <button
                onClick={handleOpenEditModal}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-4 py-3 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon active:scale-[0.98] dark:text-slate-300"
              >
                <Settings size={16} />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setShowSecurityModal(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-4 py-3 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon active:scale-[0.98] dark:text-slate-300"
              >
                <Key size={16} />
                Security & Password
              </button>
            </div>
          </div>

          <div className={sectionCardClassName}>
            <div className="mb-5 flex items-center gap-3 border-b border-border/50 pb-4 dark:border-slate-700">
              <div className="rounded-lg bg-gold/10 p-2 text-gold dark:text-slate-300">
                <User size={18} />
              </div>
              <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white">
                Personal Information
              </h2>
            </div>

            <div className="divide-y divide-border/40 dark:divide-slate-700">
              {personalInfo.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-background/70 p-2 text-gold dark:bg-slate-800/50 dark:text-slate-300">
                      {item.icon}
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary/60 dark:text-slate-400">
                      {item.label}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-maroon-dark dark:text-white md:text-right md:text-base">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={sectionCardClassName}>
            <div className="mb-5 flex items-center gap-3 border-b border-border/50 pb-4 dark:border-slate-700">
              <div className="rounded-lg bg-gold/10 p-2 text-gold dark:text-slate-300">
                <GraduationCap size={18} />
              </div>
              <h2 className="text-xl font-black tracking-tight text-maroon-dark dark:text-white">
                Academic Credentials
              </h2>
            </div>

            <div className="divide-y divide-border/40 dark:divide-slate-700">
              {academicInfo.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-background/70 p-2 text-gold dark:bg-slate-800/50 dark:text-slate-300">
                      {item.icon}
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary/60 dark:text-slate-400">
                      {item.label}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-maroon-dark dark:text-white md:max-w-[55%] md:text-right md:text-base">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border dark:border-slate-700/30 bg-white dark:bg-slate-900 p-4 text-center transition-all hover:scale-[1.005]"
              >
                <div className="mb-1 text-2xl font-black tracking-tight text-maroon-dark dark:text-white">
                  {item.value}
                </div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary/50 dark:text-slate-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-maroon-dark dark:text-white sm:text-2xl">
                Edit Profile
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50"
              >
                <X size={20} className="text-maroon-dark dark:text-slate-300" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) =>
                  handleEditInputChange("firstName", e.target.value)
                }
                placeholder="First Name"
                className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 p-3 outline-none transition-colors focus:border-gold dark:text-white"
              />
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) =>
                  handleEditInputChange("lastName", e.target.value)
                }
                placeholder="Last Name"
                className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 p-3 outline-none transition-colors focus:border-gold dark:text-white"
              />
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => handleEditInputChange("email", e.target.value)}
                placeholder="Email Address"
                className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 p-3 outline-none transition-colors focus:border-gold dark:text-white"
              />
              <input
                type="text"
                value={editForm.officePhone}
                onChange={(e) =>
                  handleEditInputChange("officePhone", e.target.value)
                }
                placeholder="Office Phone"
                className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 p-3 outline-none transition-colors focus:border-gold dark:text-white"
              />
              <input
                type="text"
                value={editForm.university}
                placeholder="University"
                disabled
                className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 p-3 outline-none transition-colors focus:border-gold dark:text-white"
              />
              <input
                type="text"
                value={editForm.department}
                placeholder="Department"
                disabled
                className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 p-3 outline-none transition-colors focus:border-gold dark:text-white"
              />
              <input
                type="text"
                value={editForm.position}
                onChange={(e) =>
                  handleEditInputChange("position", e.target.value)
                }
                placeholder="Position"
                className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 p-3 outline-none transition-colors focus:border-gold dark:text-white"
              />
              <input
                type="text"
                value={editForm.officeLocation}
                placeholder="Office Location"
                disabled
                className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 p-3 outline-none transition-colors focus:border-gold dark:text-white"
              />
              <input
                type="text"
                value={editForm.specialization}
                placeholder="Specialization"
                disabled
                className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 p-3 outline-none transition-colors focus:border-gold dark:text-white md:col-span-2"
              />
              <input
                type="text"
                value={editForm.yearsAtUniversity}
                placeholder="Years at University"
                disabled
                className="rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 p-3 outline-none transition-colors focus:border-gold dark:text-white md:col-span-2"
              />
            </div>

            <p className="mt-4 text-xs text-text-secondary dark:text-slate-400">
              University, department, office location, specialization, and
              years-at-university fields are currently read-only in Logify.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg border border-border dark:border-slate-700 px-4 py-3 text-sm font-bold text-maroon-dark dark:text-slate-300 transition-colors hover:bg-background dark:hover:bg-slate-800/50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="flex items-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-4 py-3 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon active:scale-[0.98] dark:text-slate-300"
              >
                <Save size={16} />
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-maroon-dark dark:text-white sm:text-2xl">
                Security & Password
              </h2>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50"
              >
                <X size={20} className="text-maroon-dark dark:text-slate-300" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-maroon-dark dark:text-white">
                  Current Password
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 px-3">
                  <Lock size={16} className="text-gold dark:text-slate-300" />
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      handlePasswordInputChange(
                        "currentPassword",
                        e.target.value,
                      )
                    }
                    className="w-full bg-transparent py-3 outline-none dark:text-white"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-maroon-dark dark:text-white">
                  New Password
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 px-3">
                  <Key size={16} className="text-gold dark:text-slate-300" />
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      handlePasswordInputChange("newPassword", e.target.value)
                    }
                    className="w-full bg-transparent py-3 outline-none dark:text-white"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-maroon-dark dark:text-white">
                  Confirm New Password
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-800/50 px-3">
                  <Key size={16} className="text-gold dark:text-slate-300" />
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      handlePasswordInputChange(
                        "confirmPassword",
                        e.target.value,
                      )
                    }
                    className="w-full bg-transparent py-3 outline-none dark:text-white"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowSecurityModal(false)}
                className="rounded-lg border border-border dark:border-slate-700 px-4 py-3 text-sm font-bold text-maroon-dark dark:text-slate-300 transition-colors hover:bg-background dark:hover:bg-slate-800/50"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={isUpdatingPassword}
                className="rounded-lg border border-gold/10 bg-gold/5 px-4 py-3 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon active:scale-[0.98] dark:text-slate-300"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
