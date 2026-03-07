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
    { label: "First Name", value: "Emily", icon: <User size={18} /> },
    { label: "Last Name", value: "Roberts", icon: <User size={18} /> },
    {
      label: "Email Address",
      value: "e.roberts@university.edu",
      icon: <Mail size={18} />,
    },
    {
      label: "Office Phone",
      value: "+1 (555) 987-6543",
      icon: <Phone size={18} />,
    },
  ];

  const academicInfo = [
    {
      label: "University",
      value: "University of Technology",
      icon: <GraduationCap size={18} />,
    },
    {
      label: "Department",
      value: "Computer Science",
      icon: <Building2 size={18} />,
    },
    {
      label: "Position",
      value: "Associate Professor",
      icon: <Award size={18} />,
    },
    {
      label: "Office Location",
      value: "Building A, Room 305",
      icon: <MapPin size={18} />,
    },
    {
      label: "Specialization",
      value: "Software Engineering & AI",
      icon: <ShieldCheck size={18} />,
    },
    {
      label: "Years at University",
      value: "12 years",
      icon: <Calendar size={18} />,
    },
  ];

  const stats = [
    { value: "5", label: "Current Interns", iconType: "interns" },
    { value: "15", label: "Total Students", iconType: "evaluations" },
    { value: "86.6%", label: "Average Score", iconType: "reviews" },
    { value: "95%", label: "Completion Rate", iconType: "placements" },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 px-12 py-10 font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
          My <span className="text-gold">Profile</span>
        </h1>
        <p className="text-lg text-text-secondary/80 max-w-2xl leading-relaxed">
          Manage your professional identity and academic credentials within the
          Logify ecosystem.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[12px] p-10 border border-border text-center shadow-sm sticky top-10">
            <div className="relative inline-block mb-8">
              <div className="h-40 w-40 rounded-full bg-maroon-dark border-4 border-gold/20 flex items-center justify-center text-5xl font-black text-gold shadow-2xl">
                ER
              </div>
              <div className="absolute bottom-2 right-2 p-3 bg-white rounded-full border border-border shadow-lg text-maroon-dark cursor-pointer hover:text-gold transition-colors">
                <Settings size={20} />
              </div>
            </div>

            <h2 className="text-3xl font-black text-maroon-dark tracking-tight">
              Dr. Emily Roberts
            </h2>
            <p className="text-md font-bold text-gold uppercase tracking-widest mt-2">
              Academic Supervisor
            </p>
            <p className="text-sm text-text-secondary mt-1 font-medium">
              Department of Computer Science
            </p>

            <div className="mt-10 space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-maroon-dark text-white rounded-xl font-bold shadow-lg shadow-maroon-dark/10 hover:scale-[1.02] transition-transform">
                <Settings size={18} className="text-gold" />
                Edit Account Details
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border border-border text-maroon-dark rounded-xl font-bold hover:bg-background transition-colors">
                <Key size={18} className="text-gold" />
                Security & Password
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[12px] p-10 border border-border">
            <div className="flex items-center gap-3 mb-10 border-b border-border/50 pb-6">
              <div className="p-2 bg-maroonCustom/10 rounded-lg text-maroonCustom">
                <User size={20} />
              </div>
              <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {personalInfo.map((item) => (
                <div key={item.label} className="group">
                  <div className="flex items-center gap-2 mb-2 text-text-secondary/40 group-hover:text-gold transition-colors">
                    {item.icon}
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-maroon-dark group-hover:pl-1 transition-all">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[12px] p-10 border border-border">
            <div className="flex items-center gap-3 mb-10 border-b border-border/50 pb-6">
              <div className="p-2 bg-gold/10 rounded-lg text-gold">
                <GraduationCap size={20} />
              </div>
              <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
                Academic Credentials
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {academicInfo.map((item) => (
                <div key={item.label} className="group">
                  <div className="flex items-center gap-2 mb-2 text-text-secondary/40 group-hover:text-gold transition-colors">
                    {item.icon}
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-maroon-dark group-hover:pl-1 transition-all">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-2xl p-6 border border-border shadow-sm flex flex-col items-center text-center transition-all hover:border-gold/30 hover:shadow-lg"
              >
                <div className="text-3xl font-black text-maroon-dark mb-1 tracking-tight">
                  {item.value}
                </div>
                <div className="text-[8px] font-black text-text-secondary/40 uppercase tracking-widest">
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
