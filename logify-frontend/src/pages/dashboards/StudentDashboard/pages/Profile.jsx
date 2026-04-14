import {
  User,
  Mail,
  GraduationCap,
  School,
  Calendar,
  Shield,
  Lock,
  Bell,
} from "lucide-react";
import { api } from "@/config/api.js";
import ChangePassword from "../ChangePassword";
import EditProfile from "../EditProfile";
import { useState, useEffect } from "react";

const Profile = () => {
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [personalInformation, setPersonalInformation] = useState(null);
  const [academicInformation, setAcademicInformation] = useState(null);

  const [errorI, setErrorI] = useState(null);
  const [errorP, setErrorP] = useState(null);

  useEffect(() => {
    const fetchPersonalInformation = async () => {
      try {
        const data = await api.auth.me();
        setPersonalInformation(data);
      } catch (err) {
        setErrorP(err);
      }
    };
    fetchPersonalInformation();
  }, []);

  useEffect(() => {
    if (!personalInformation) return;
    if (!personalInformation.institution_id) return;
    const fetchAcademicInformation = async () => {
      try {
        const institution = await api.academics.getInstitution(
          personalInformation.institution_id,
        );

        let programme = null;
        if (personalInformation.programme_id) {
          console.log(
            "Fetching Programme for ID:",
            personalInformation.programme_id,
          );
          try {
            programme = await api.academics.getProgramme(
              personalInformation.programme_id,
            );
            console.log("Programme:", programme);
          } catch (err) {
            console.error("Programme fetch error:", err);
          }
        } else {
          console.warn(
            "No programme_id found in personalInformation:",
            personalInformation,
          );
        }

        let registry = null;
        if (personalInformation.student_registry_id) {
          try {
            registry = await api.registry.getStudent(
              personalInformation.student_registry_id,
            );
          } catch (err) {
            console.error("Registry fetch error:", err);
          }
        }

        let placement = null;
        if (personalInformation.student_registry_id) {
          try {
            const response = await api.placements.getPlacements();
            placement = response.length > 0 ? response[0] : null;
          } catch (err) {
            console.error("Placement fetch error:", err);
          }
        }
        setAcademicInformation({ institution, programme, registry, placement });
      } catch (err) {
        setErrorI(err);
      }
    };
    fetchAcademicInformation();
  }, [personalInformation]);

  return (
    <div className="dark:bg-slate-950 min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans">
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
        <div className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border shadow-sm flex items-center gap-10">
          {personalInformation ? (
            <>
              <div>
                <div className="md:h-32 md:w-32 lg:h-32 lg:w-32 bg-maroonCustom md:rounded-[12px] sm:rounded-[12px] lg:rounded-full sm:h-18 sm:w-18 flex items-center justify-center text-white text-5xl font-black shadow-lg shadow-maroonCustom/20 transition-all">
                  {personalInformation.first_name[0]}
                  {personalInformation.last_name[0]}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-maroon-dark tracking-tight mb-1">
                    {personalInformation.first_name}{" "}
                    {personalInformation.last_name}
                  </h2>
                  <p className="text-sm font-bold text-gold uppercase tracking-widest mb-4">
                    Software Engineering Student
                  </p>
                  <div className="flex gap-2">
                    <button
                      className=" text-xs font-bold text-white px-5 py-2.5 bg-maroonCustom hover:bg-red-800 transition-all rounded-lg shadow-md"
                      onClick={() => setIsModal1Open(true)}
                    >
                      Edit Profile
                    </button>
                    <EditProfile
                      isOpen={isModal1Open}
                      onClose={() => setIsModal1Open(false)}
                    />
                    <button
                      className="dark:bg-slate-900 dark:hover:bg-slate-700 hover:bg-gray-200 text-xs font-bold px-5 py-2.5 transition-all rounded-lg border border-gray-200"
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
              </div>
            </>
          ) : errorP ? (
            <p>Something went wrong: {errorP.message}</p>
          ) : null}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border h-full">
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
              {
                label: "First Name",
                value:
                  personalInformation?.first_name ||
                  (errorP ? `Error: ${errorP.message}` : "Loading..."),
                icon: User,
              },
              {
                label: "Last Name",
                value:
                  personalInformation?.last_name ||
                  (errorP ? `Error: ${errorP.message}` : "Loading..."),
                icon: User,
              },
              {
                label: "Webmail",
                value:
                  personalInformation?.email ||
                  (errorP ? `Error: ${errorP.message}` : "Loading..."),
                icon: Mail,
              },
              {
                label: "Student Number",
                value:
                  personalInformation?.student_number ||
                  (errorP ? `Error: ${errorP.message}` : "Loading..."),
                icon: User,
              },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-[11px] uppercase font-black text-text-secondary/40 tracking-widest mb-1">
                  {item.label}
                </p>
                <p className="text-md font-semibold truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border h-full">
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
                value:
                  academicInformation?.institution.name ??
                  (errorI ? `Error: ${errorI.message}` : "null"),
                icon: School,
              },
              {
                label: "Programme",
                value: academicInformation?.programme?.name ?? "Not Assigned",
                icon: GraduationCap,
              },
              {
                label: "Year Level",
                value: personalInformation?.year_of_study
                  ? `Year ${personalInformation.year_of_study}`
                  : "Not Available",
                icon: Calendar,
              },
              {
                label: "Academic Supervisor",
                value:
                  academicInformation?.placement?.academic_supervisor ??
                  "Not Assigned",
                icon: User,
              },
              {
                label: "Workplace Supervisor",
                value:
                  academicInformation?.placement?.workplace_supervisor ??
                  "Not Assigned",
                icon: User,
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
        <div className="dark:bg-slate-900 bg-white rounded-[12px] p-10 border border-border">
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
                status: ["Disabled", "Enabled"],
                icon: Bell,
                active: emailEnabled,
                toggle: () => setEmailEnabled((prev) => !prev),
              },
              {
                title: "Two-Factor Authentication",
                desc: "Add an extra layer of security to your student portal access.",
                status: ["Disabled", "Enabled"],
                icon: Lock,
                active: twoFactorEnabled,
                toggle: () => setTwoFactorEnabled((prev) => !prev),
              },
            ].map((setting, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-6 p-6 bg-background/50 rounded-[12px] border border-border/30 hover:bg-background transition-colors"
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
                <div className="w-full sm:w-auto">
                  <button
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      setting.active
                        ? "bg-maroonCustom text-white hover:bg-red-800"
                        : "bg-maroonCustom text-white hover:bg-red-800"
                    }`}
                    onClick={setting.toggle}
                  >
                    {setting.active ? "Enabled" : "Disabled"}
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
