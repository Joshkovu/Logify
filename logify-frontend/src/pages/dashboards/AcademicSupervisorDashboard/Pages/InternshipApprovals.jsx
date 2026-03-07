import MetricCard from "../../../../components/ui/MetricCard";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  User,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";

const InternshipApprovals = () => {
  const stats = [
    {
      title: "Pending Approvals",
      value: "2",
      iconType: "placements",
    },
    {
      title: "Approved This Month",
      value: "8",
      iconType: "evaluations",
    },
    {
      title: "Approval Rate",
      value: "95%",
      iconType: "reviews",
    },
  ];

  const approvals = [
    {
      name: "David Chen",
      regNo: "2024001456",
      program: "Computer Science",
      submittedOn: "Feb 23, 2026",
      organization: "FinTech Corp",
      address: "789 Finance Ave, Financial District, NY 10004",
      position: "Software Development Intern",
      duration: "March 1, 2026 - May 24, 2026",
      supervisor: "Jennifer Lee",
      email: "j.lee@fintechcorp.com",
      phone: "+1 (555) 789-0123",
      status: "Pending",
    },
    {
      name: "Maria Garcia",
      regNo: "2024001567",
      program: "Information Technology",
      submittedOn: "Feb 22, 2026",
      organization: "InnovateTech",
      address: "321 Design Street, Creative Quarter, SF 94103",
      position: "UI/UX Design Intern",
      duration: "March 8, 2026 - May 31, 2026",
      supervisor: "Thomas Anderson",
      email: "t.anderson@innovatetech.com",
      phone: "+1 (555) 890-1234",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 px-12 py-10 font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
          Internship <span className="text-gold">Approvals</span>
        </h1>
        <p className="text-lg text-text-secondary/80 max-w-2xl leading-relaxed">
          Review and authorize student internship placement requests for the
          current semester.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            iconType={stat.iconType}
          />
        ))}
      </section>

      <section className="space-y-10">
        {approvals.map((item) => (
          <div
            key={item.name}
            className="bg-white rounded-[12px] p-10 border border-border hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start mb-10 pb-6 border-b border-border/50">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-gold/10 text-gold flex items-center justify-center font-black text-2xl">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-maroon-dark tracking-tight">
                    {item.name}
                  </h2>
                  <p className="text-sm font-bold text-text-secondary/60 tracking-widest uppercase">
                    Reg: {item.regNo} &bull; {item.program}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gold/10 px-6 py-2 rounded-full border border-gold/20">
                <Clock className="text-gold" size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gold">
                  {item.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4 text-maroonCustom">
                    <Building2 size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest">
                      Organization Details
                    </h3>
                  </div>
                  <div className="bg-background/50 p-6 rounded-2xl border border-border/30">
                    <p className="text-lg font-bold text-maroon-dark">
                      {item.organization}
                    </p>
                    <div className="flex items-start gap-2 mt-2 text-text-secondary">
                      <MapPin size={16} className="mt-1 shrink-0" />
                      <p className="text-sm font-medium">{item.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4 text-maroonCustom">
                    <Briefcase size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest">
                      Placement Specifics
                    </h3>
                  </div>
                  <div className="bg-background/50 p-6 rounded-2xl border border-border/30">
                    <p className="text-lg font-bold text-maroon-dark">
                      {item.position}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-text-secondary">
                      <Calendar size={16} />
                      <p className="text-sm font-medium">{item.duration}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-maroonCustom">
                  <User size={20} />
                  <h3 className="text-sm font-black uppercase tracking-widest">
                    Workplace Supervisor
                  </h3>
                </div>
                <div className="bg-background/50 p-6 rounded-2xl border border-border/30 space-y-4">
                  <p className="text-lg font-bold text-maroon-dark">
                    {item.supervisor}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-text-secondary hover:text-maroon-dark transition-colors cursor-pointer">
                      <Mail size={16} />
                      <p className="text-sm font-medium">{item.email}</p>
                    </div>
                    <div className="flex items-center gap-3 text-text-secondary hover:text-maroon-dark transition-colors cursor-pointer">
                      <Phone size={16} />
                      <p className="text-sm font-medium">{item.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <p className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest">
                    Submission Date
                  </p>
                  <p className="text-md font-bold text-maroon-dark">
                    {item.submittedOn}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-8 border-t border-border/50">
              <button className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-maroon-dark text-white rounded-xl font-bold shadow-lg shadow-maroon-dark/20 hover:scale-[1.02] transition-transform">
                <CheckCircle2 size={20} className="text-gold" />
                Authorize Placement
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white border border-maroonCustom text-maroonCustom rounded-xl font-bold hover:bg-red-50 transition-colors">
                <XCircle size={20} />
                Decline Request
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default InternshipApprovals;
