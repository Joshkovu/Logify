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
} from "lucide-react";

const Profile = () => {
  const personalInfo = [
    { label: "First Name", value: "Emily", icon: <User size={16} /> },
    { label: "Last Name", value: "Roberts", icon: <User size={16} /> },
    {
      label: "Email Address",
      value: "e.roberts@university.edu",
      icon: <Mail size={16} />,
    },
    {
      label: "Office Phone",
      value: "+1 (555) 987-6543",
      icon: <Phone size={16} />,
    },
  ];

  const academicInfo = [
    {
      label: "University",
      value: "University of Technology",
      icon: <GraduationCap size={16} />,
    },
    {
      label: "Department",
      value: "Computer Science",
      icon: <Building2 size={16} />,
    },
    {
      label: "Position",
      value: "Associate Professor",
      icon: <Award size={16} />,
    },
    {
      label: "Office Location",
      value: "Building A, Room 305",
      icon: <MapPin size={16} />,
    },
    {
      label: "Specialization",
      value: "Software Engineering & AI",
      icon: <ShieldCheck size={16} />,
    },
    {
      label: "Years at University",
      value: "12 years",
      icon: <Calendar size={16} />,
    },
  ];

  const stats = [
    { value: "5", label: "Current Interns" },
    { value: "15", label: "Total Students" },
    { value: "86.6%", label: "Average Score" },
    { value: "95%", label: "Completion Rate" },
  ];

  const sectionCardClassName =
    "rounded-[14px] border border-border bg-white p-6 shadow-sm";

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-6 py-8 font-sans md:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="mb-2 text-4xl font-black tracking-tighter text-maroon-dark md:text-5xl">
            My <span className="text-gold">Profile</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-text-secondary/80 md:text-lg">
            Manage your professional identity and academic credentials within
            the Logify ecosystem.
          </p>
        </header>

        <div className="space-y-6">
          <div className="rounded-[14px] border border-border bg-[#FEFEFC] p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#7A1C1C] text-xl font-black text-black shadow-lg">
                  ER
                </div>

                <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-maroon-dark shadow-sm transition-colors hover:text-gold">
                  <Settings size={14} />
                </button>
              </div>

              <h2 className="text-xl font-black tracking-tight text-maroon-dark md:text-2xl">
                Dr. Emily Roberts
              </h2>

              <p className="mt-2 rounded-full bg-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gold">
                Academic Supervisor
              </p>

              <p className="mt-2 text-sm font-medium text-text-secondary">
                Department of Computer Science
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/40 bg-white p-3 text-center">
                <p className="text-xl font-black text-maroon-dark">5</p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-text-secondary/50">
                  Current Interns
                </p>
              </div>

              <div className="rounded-xl border border-border/40 bg-white p-3 text-center">
                <p className="text-xl font-black text-maroon-dark">15</p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-text-secondary/50">
                  Total Students
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-maroon-dark px-4 py-3 font-bold text-white shadow-sm transition-transform hover:scale-[1.01]">
                <Settings size={16} className="text-black" />
                <span className="text-black">Edit Profile</span>
              </button>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-[#FEFEFC] px-4 py-3 font-bold text-maroon-dark transition-colors hover:bg-background">
                <Key size={16} className="text-black" />
                Security & Password
              </button>
            </div>
          </div>

          <div className={sectionCardClassName}>
            <div className="mb-5 flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="rounded-lg bg-maroonCustom/10 p-2 text-maroonCustom">
                <User size={18} />
              </div>
              <h2 className="text-xl font-black tracking-tight text-maroon-dark">
                Personal Information
              </h2>
            </div>

            <div className="divide-y divide-border/40">
              {personalInfo.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-background/70 p-2 text-gold">
                      {item.icon}
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-text-secondary/60">
                      {item.label}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-maroon-dark md:text-right md:text-base">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={sectionCardClassName}>
            <div className="mb-5 flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="rounded-lg bg-gold/10 p-2 text-gold">
                <GraduationCap size={18} />
              </div>
              <h2 className="text-xl font-black tracking-tight text-maroon-dark">
                Academic Credentials
              </h2>
            </div>

            <div className="divide-y divide-border/40">
              {academicInfo.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-background/70 p-2 text-gold">
                      {item.icon}
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-text-secondary/60">
                      {item.label}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-maroon-dark md:max-w-[55%] md:text-right md:text-base">
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
                className="rounded-xl border border-border bg-white p-4 text-center shadow-sm transition-all hover:border-gold/30"
              >
                <div className="mb-1 text-2xl font-black tracking-tight text-maroon-dark">
                  {item.value}
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest text-text-secondary/50">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;