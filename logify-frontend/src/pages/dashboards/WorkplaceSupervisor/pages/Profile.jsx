import { useEffect, useMemo, useState } from "react";
import { Key, Save, Settings, X } from "lucide-react";

import {
  formatDate,
  loadWorkplaceSupervisorData,
} from "../utils/workplaceSupervisorData";
import { api } from "../../../../config/api";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const snapshot = await loadWorkplaceSupervisorData();
        setMe(snapshot.me);
        setPlacements(snapshot.placements);
        setWeeklyLogs(snapshot.weeklyLogs);
        setEditForm({
          firstName: snapshot.me?.first_name || "",
          lastName: snapshot.me?.last_name || "",
          email: snapshot.me?.email || "",
          phone: snapshot.me?.phone || "",
          title: snapshot.me?.staff_profile?.title || "",
        });
      } catch (loadError) {
        setError(loadError.message || "Unable to load profile details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const reviewedLogsCount = useMemo(
    () =>
      weeklyLogs.filter((log) =>
        ["approved", "rejected", "changes_requested"].includes(log.status),
      ).length,
    [weeklyLogs],
  );

  const approvedRate = useMemo(() => {
    if (reviewedLogsCount === 0) return 0;
    const approvedCount = weeklyLogs.filter(
      (log) => log.status === "approved",
    ).length;
    return Math.round((approvedCount / reviewedLogsCount) * 100);
  }, [weeklyLogs, reviewedLogsCount]);

  const handleEditInputChange = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordForm((current) => ({ ...current, [field]: value }));
  };

  const handleSaveProfile = async () => {
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
        phone: editForm.phone.trim(),
        title: editForm.title.trim(),
      });
      setMe(updated);
      setEditForm({
        firstName: updated.first_name || "",
        lastName: updated.last_name || "",
        email: updated.email || "",
        phone: updated.phone || "",
        title: updated.staff_profile?.title || "",
      });
      setShowEditModal(false);
    } catch (saveError) {
      setError(saveError.message || "Unable to update your profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setError("All password fields are required.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await api.auth.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordModal(false);
    } catch (passwordError) {
      setError(passwordError.message || "Unable to update your password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-6 py-8 font-sans transition-colors duration-300 dark:bg-slate-950 lg:px-10">
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-maroon-dark dark:text-white">
          Workplace Supervisor Profile
        </h1>
        <p className="mt-2 text-sm text-text-secondary dark:text-slate-300">
          Your account and supervision statistics from live API data.
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
            Assigned Interns
          </p>
          <p className="mt-2 text-3xl font-black text-maroon-dark dark:text-gold">
            {isLoading ? "..." : placements.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
            Reviewed Logs
          </p>
          <p className="mt-2 text-3xl font-black text-maroon-dark dark:text-gold">
            {isLoading ? "..." : reviewedLogsCount}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
            Approval Rate
          </p>
          <p className="mt-2 text-3xl font-black text-maroon-dark dark:text-gold">
            {isLoading ? "..." : `${approvedRate}%`}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
            Role
          </p>
          <p className="mt-2 text-3xl font-black text-maroon-dark dark:text-gold">
            {isLoading ? "..." : "Workplace Supervisor"}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-maroon dark:text-slate-200">
          Personal Information
        </h2>

        {isLoading ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
            Loading profile details...
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <p>
              <span className="font-semibold">Name:</span> {me?.first_name}{" "}
              {me?.last_name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {me?.email || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {me?.phone || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Department:</span>{" "}
              {me?.staff_profile?.department_name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Title:</span>{" "}
              {me?.staff_profile?.title || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Staff Number:</span>{" "}
              {me?.staff_profile?.staff_number || "N/A"}
            </p>
          </div>
        )}

        {!isLoading && (
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-4 py-3 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon"
            >
              <Settings size={16} />
              Edit Profile
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-4 py-3 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon"
            >
              <Key size={16} />
              Change Password
            </button>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-lg border border-border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-maroon dark:text-slate-200">
          Recent Assigned Placements
        </h2>
        <p className="text-sm text-text-secondary dark:text-slate-400">
          Latest placements tied to your supervisor account.
        </p>

        <div className="mt-4 space-y-3">
          {!isLoading && placements.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              No placements have been assigned to you yet.
            </p>
          )}

          {placements.slice(0, 5).map((placement) => (
            <div
              key={placement.id}
              className="rounded-lg border border-stone-200 p-4 dark:border-slate-700"
            >
              <p className="font-semibold">{placement.internship_title}</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {formatDate(placement.start_date)} -{" "}
                {formatDate(placement.end_date)}
              </p>
              <p className="mt-1 text-xs uppercase text-gray-500 dark:text-slate-500">
                Status: {placement.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-[12px] border border-border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-maroon-dark dark:text-white">
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
                className="rounded-xl border border-border bg-background p-3 outline-none transition-colors focus:border-gold dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) =>
                  handleEditInputChange("lastName", e.target.value)
                }
                placeholder="Last Name"
                className="rounded-xl border border-border bg-background p-3 outline-none transition-colors focus:border-gold dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => handleEditInputChange("email", e.target.value)}
                placeholder="Email"
                className="rounded-xl border border-border bg-background p-3 outline-none transition-colors focus:border-gold dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => handleEditInputChange("phone", e.target.value)}
                placeholder="Phone"
                className="rounded-xl border border-border bg-background p-3 outline-none transition-colors focus:border-gold dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
              <input
                type="text"
                value={me?.staff_profile?.department_name || ""}
                disabled
                placeholder="Department"
                className="rounded-xl border border-border bg-background p-3 opacity-70 outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => handleEditInputChange("title", e.target.value)}
                placeholder="Title"
                className="rounded-xl border border-border bg-background p-3 outline-none transition-colors focus:border-gold dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            <p className="mt-4 text-xs text-text-secondary dark:text-slate-400">
              Department is managed centrally and is read-only here.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg border border-border px-4 py-3 text-sm font-bold text-maroon-dark transition-colors hover:bg-background dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-4 py-3 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon"
              >
                <Save size={16} />
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-[12px] border border-border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-maroon-dark dark:text-white">
                Change Password
              </h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50"
              >
                <X size={20} className="text-maroon-dark dark:text-slate-300" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  handlePasswordInputChange("currentPassword", e.target.value)
                }
                placeholder="Current password"
                className="w-full rounded-xl border border-border bg-background p-3 outline-none transition-colors focus:border-gold dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  handlePasswordInputChange("newPassword", e.target.value)
                }
                placeholder="New password"
                className="w-full rounded-xl border border-border bg-background p-3 outline-none transition-colors focus:border-gold dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  handlePasswordInputChange("confirmPassword", e.target.value)
                }
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-border bg-background p-3 outline-none transition-colors focus:border-gold dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="rounded-lg border border-border px-4 py-3 text-sm font-bold text-maroon-dark transition-colors hover:bg-background dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isUpdatingPassword}
                className="rounded-lg border border-gold/10 bg-gold/5 px-4 py-3 text-sm font-bold text-gold transition-all hover:bg-gold/10 hover:text-maroon"
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
