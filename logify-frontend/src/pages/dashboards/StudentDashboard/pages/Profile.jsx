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
import { useState } from "react";

const Profile = () => {
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
          My <span className="text-gold">Profile</span>
        </h1>
        <p className="text-lg text-text-secondary/80 max-w-lg leading-relaxed">
          Manage your personal information, academic records, and security
          settings.
        </p>
      </header>

      <section className="mb-12">
        <div className="bg-white rounded-2xl p-10 border border-border shadow-sm flex items-center gap-10">
          <div className="md:h-32 md:w-32 lg:h-32 lg:w-32 bg-maroonCustom md:rounded-2xl sm:rounded-2xl lg:rounded-full sm:h-18 sm:w-18 flex items-center justify-center text-white text-5xl font-black shadow-lg shadow-maroonCustom/20 transition-all">
            SJ
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-black text-maroon-dark tracking-tight mb-1">
              Sarah Johnson
            </h2>
            <p className="text-sm font-bold text-gold uppercase tracking-widest mb-4">
              Software Engineering Student
            </p>
            <div className="flex gap-2">
              <button
                className="text-xs font-bold text-white px-5 py-2.5 bg-maroonCustom hover:bg-red-800 transition-all rounded-lg shadow-md"
                onClick={() => setIsModal1Open(true)}
              >
                Edit Profile
              </button>
              <EditProfile
                isOpen={isModal1Open}
                onClose={() => setIsModal1Open(false)}
              />
              <button
                className="hover:bg-gray-200 text-xs font-bold px-5 py-2.5 transition-all rounded-lg border border-gray-200"
                onClick={() => setIsModal2Open(true)}
              >
                Change Password
              </button>
              <ChangePassword
                isOpen={isModal2Open}
                onClose={() => setIsModal2Open(false)}
              />
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] uppercase font-bold text-text-secondary/40 tracking-widest mb-1">
              Student ID
            </p>
            <p className="lg:text-lg md:text-sm sm:text-sm font-bold">
              #STR-2024-0427
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="bg-white rounded-2xl p-10 border border-border h-full">
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
            {[
              { label: "First Name", value: "Sarah", icon: User },
              { label: "Last Name", value: "Johnson", icon: User },
              {
                label: "Email Address",
                value: "sarah.j@university.edu",
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

        <section className="bg-white rounded-2xl p-10 border border-border h-full">
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
        <div className="bg-white rounded-2xl p-10 border border-border">
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
                className="flex items-center gap-6 p-6 bg-background/50 rounded-2xl border border-border/30 hover:bg-background transition-colors"
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
