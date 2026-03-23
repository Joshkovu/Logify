import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  School,
  Calendar,
  Shield,
  Lock,
  Bell,
} from "lucide-react";
import ChangePassword from "../ChangePassword";
import EditProfile from "../EditProfile";
import { useState, useMemo, useCallback } from "react";
import { useAuth } from "../../../../contexts/AuthContext";

const Profile = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { user } = useAuth();

  // Memoize user initials
  const userInitials = useMemo(() => {
    if (!user?.fullName) return "U";
    const names = user.fullName.split(" ");
    return names
      .map((n) => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }, [user?.fullName]);

  // Memoize handler functions
  const handleEditClick = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handlePasswordClick = useCallback(() => {
    setIsPasswordModalOpen(true);
  }, []);

  const handleEditClose = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handlePasswordClose = useCallback(() => {
    setIsPasswordModalOpen(false);
  }, []);

  // Profile information with fallbacks
  const profileInfo = useMemo(
    () => [
      { label: "First Name", value: user?.fullName?.split(" ")[0] || "N/A", icon: User },
      { label: "Last Name", value: user?.fullName?.split(" ")[1] || "N/A", icon: User },
      {
        label: "Email Address",
        value: user?.email || "N/A",
        icon: Mail,
      },
      {
        label: "Phone",
        value: "+256 (701) 234-5678",
        icon: Phone,
      },
      {
        label: "Institution",
        value: user?.institution || "Not specified",
        icon: School,
      },
      {
        label: "Department",
        value: user?.department || "Not specified",
        icon: GraduationCap,
      },
    ],
    [user]
  );

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
          My <span className="text-gold">Profile</span>
        </h1>
        <p className="text-lg text-text-secondary/80 max-w-lg leading-relaxed">
          Manage your personal information, academic records, and security
          settings.
        </p>
      </header>

      {/* User Card Section */}
      <section className="mb-12">
        <div className="bg-white rounded-[12px] p-10 border border-border shadow-sm flex items-center gap-10">
          <div className="md:h-32 md:w-32 lg:h-32 lg:w-32 bg-maroonCustom md:rounded-[12px] sm:rounded-[12px] lg:rounded-full sm:h-18 sm:w-18 flex items-center justify-center text-white text-5xl font-black shadow-lg shadow-maroonCustom/20 transition-all">
            {userInitials}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-black text-maroon-dark tracking-tight mb-1">
              {user?.fullName || "Student"}
            </h2>
            <p className="text-sm font-bold text-gold uppercase tracking-widest mb-4">
              Software Engineering Student
            </p>
            <div className="flex gap-2">
              <button
                className="text-xs font-bold text-white px-5 py-2.5 bg-maroonCustom hover:bg-red-800 transition-all rounded-lg shadow-md"
                onClick={handleEditClick}
              >
                Edit Profile
              </button>
              <EditProfile
                isOpen={isEditModalOpen}
                onClose={handleEditClose}
              />
              <button
                className="hover:bg-gray-200 text-xs font-bold px-5 py-2.5 transition-all rounded-lg border border-gray-200"
                onClick={handlePasswordClick}
              >
                Change Password
              </button>
              <ChangePassword
                isOpen={isPasswordModalOpen}
                onClose={handlePasswordClose}
              />
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] uppercase font-bold text-text-secondary/40 tracking-widest mb-1">
              Student ID
            </p>
            <p className="lg:text-lg md:text-sm sm:text-sm font-bold">
              {user?.matriculationNumber || "#STR-2024-0427"}
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Personal Information Section */}
        <section className="bg-white rounded-[12px] p-10 border border-border h-full">
          <div className="mb-8 flex items-center gap-3">
            <div className="p-2 bg-maroonCustom/10 rounded-lg text-maroonCustom">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-maroon-dark tracking-tight">
                Personal Information
              </h3>
              <p className="text-xs text-text-secondary font-medium">
                Basic identity and contact details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            {profileInfo.map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-gold" />
                  <p className="text-[10px] uppercase text-text-secondary/60 font-black tracking-widest">
                    {label}
                  </p>
                </div>
                <p className="text-sm font-bold text-maroon-dark">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white rounded-[12px] p-10 border border-border h-full">
          <div className="mb-8 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-maroon-dark tracking-tight">
                Security
              </h3>
              <p className="text-xs text-text-secondary font-medium">
                Manage your account security
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase text-text-secondary/60 font-black tracking-widest mb-2">
                Password Status
              </p>
              <p className="text-sm font-semibold text-maroon-dark mb-4">
                Strong password set
              </p>
              <button
                onClick={handlePasswordClick}
                className="text-xs font-bold text-white px-4 py-2 bg-red-600 hover:bg-red-700 transition-all rounded-lg"
              >
                Change Password
              </button>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-[10px] uppercase text-text-secondary/60 font-black tracking-widest mb-2">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-text-secondary mb-3 font-medium">
                Add an extra layer of security to your account
              </p>
              <button className="text-xs font-bold text-maroonCustom px-4 py-2 border border-maroonCustom rounded-lg hover:bg-maroonCustom/5 transition-all">
                Enable
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Preferences Section */}
      <section className="bg-white rounded-[12px] p-10 border border-border">
        <div className="mb-8 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-maroon-dark tracking-tight">
              Notifications
            </h3>
            <p className="text-xs text-text-secondary font-medium">
              Manage your notification preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { name: "Email Notifications", enabled: true },
            { name: "Log Submission Reminders", enabled: true },
            { name: "Evaluation Updates", enabled: true },
            { name: "Weekly Digest", enabled: false },
          ].map(({ name, enabled }) => (
            <div
              key={name}
              className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50"
            >
              <span className="text-sm font-semibold text-maroon-dark">
                {name}
              </span>
              <input
                type="checkbox"
                defaultChecked={enabled}
                className="h-5 w-5 rounded cursor-pointer"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
                icon: Mail,
              },
              {
                label: "Phone Number",
                value: "+1 (555) 234-5678",
                icon: Phone,
              },
              {
                label: "Date of Birth",
                value: "March 15, 2002",
                icon: Calendar,
              },
              {
                label: "Address",
                value: "123 Student Lane, Campus City",
                icon: MapPin,
              },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-[11px] uppercase font-black text-text-secondary/40 tracking-widest mb-1">
                  {item.label}
                </p>
                <p className="text-md font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-[12px] p-10 border border-border h-full">
          <div className="mb-8 flex items-center gap-3">
            <div className="p-2 bg-maroonCustom/10 rounded-lg text-maroonCustom">
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-maroon-dark tracking-tight">
                Academic Details
              </h3>
              <p className="text-xs text-text-secondary font-medium">
                University and program records
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            {[
              {
                label: "University",
                value: "University of Technology",
                icon: School,
              },
              { label: "Faculty", value: "Engineering & Tech", icon: School },
              {
                label: "Program",
                value: "B.Sc. Software Engineering",
                icon: GraduationCap,
              },
              {
                label: "Year Level",
                value: "4th Year (Finalist)",
                icon: Calendar,
              },
              {
                label: "Academic Guard",
                value: "Dr. Emily Roberts",
                icon: User,
              },
              {
                label: "Graduation",
                value: "June 2026 (Expected)",
                icon: Calendar,
              },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-[11px] uppercase font-black text-text-secondary/40 tracking-widest mb-1">
                  {item.label}
                </p>
                <p className="text-md font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <div className="bg-white rounded-[12px] p-10 border border-border">
          <div className="mb-8 flex items-center gap-3">
            <div className="p-2 bg-maroonCustom/10 rounded-lg text-maroonCustom">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-maroon-dark tracking-tight">
                Security & Preferences
              </h3>
              <p className="text-xs text-text-secondary font-medium">
                Protect your account and manage notification settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Email Notifications",
                desc: "Receive real-time updates about log approvals and evaluations.",
                status: "Enabled",
                icon: Bell,
                active: true,
              },
              {
                title: "Two-Factor Authentication",
                desc: "Add an extra layer of security to your student portal access.",
                status: "Disabled",
                icon: Lock,
                active: false,
              },
            ].map((setting, i) => (
              <div
                key={i}
                className="flex items-center gap-6 p-6 bg-background/50 rounded-[12px] border border-border/30 hover:bg-background transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <setting.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-md font-bold text-maroon-dark">
                    {setting.title}
                  </h4>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {setting.desc}
                  </p>
                </div>
                <div>
                  <button
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      setting.active
                        ? "bg-maroonCustom text-white hover:bg-red-800"
                        : "bg-white border-border text-text-secondary hover:bg-gray-50"
                    }`}
                  >
                    {setting.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
