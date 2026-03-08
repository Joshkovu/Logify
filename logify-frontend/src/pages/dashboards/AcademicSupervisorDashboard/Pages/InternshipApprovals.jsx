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

const pageCard =
  "rounded-[12px] border border-border bg-white p-10 shadow-sm transition-all hover:shadow-md";

const infoCard = "rounded-2xl border border-border/30 bg-[#FCFBF8] p-6";

const sectionLabel =
  "text-[10px] font-black uppercase tracking-widest text-text-secondary/50";

const InternshipApprovals = () => {
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans">
      <header className="mb-12">
        <h1 className="mb-3 text-5xl font-black tracking-tighter text-maroon-dark">
          Internship <span className="text-gold">Approvals</span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-text-secondary/80">
          Review and authorize student internship placement requests for the
          current semester.
        </p>
      </header>

      <section className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            iconType={stat.iconType}
          />
        ))}
      </section>

      <section className="space-y-8">
        {approvals.map((item) => (
          <div key={item.name} className={pageCard}>
            <div className="mb-8 flex flex-col gap-6 border-b border-border/50 pb-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-2xl font-black text-gold">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h2 className="text-3xl font-black tracking-tight text-maroon-dark">
                      {item.name}
                    </h2>

                    <div className="flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5">
                      <Clock size={16} className="text-gold" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gold">
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-bold uppercase tracking-widest text-text-secondary/60">
                    Reg: {item.regNo} &bull; {item.program}
                  </p>

                  <div className="mt-4">
                    <p className={sectionLabel}>Submission Date</p>
                    <p className="mt-1 text-sm font-bold text-maroon-dark">
                      {item.submittedOn}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10 grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className={infoCard}>
                <div className="mb-4 flex items-center gap-2 text-maroonCustom">
                  <Building2 size={18} />
                  <h3 className="text-sm font-black uppercase tracking-widest">
                    Organization Details
                  </h3>
                </div>

                <p className="text-lg font-bold text-maroon-dark">
                  {item.organization}
                </p>

                <div className="mt-4 flex items-start gap-3 text-text-secondary">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-medium leading-relaxed">
                    {item.address}
                  </p>
                </div>
              </div>

              <div className={infoCard}>
                <div className="mb-4 flex items-center gap-2 text-maroonCustom">
                  <Briefcase size={18} />
                  <h3 className="text-sm font-black uppercase tracking-widest">
                    Placement Specifics
                  </h3>
                </div>

                <p className="text-lg font-bold text-maroon-dark">
                  {item.position}
                </p>

                <div className="mt-4 flex items-start gap-3 text-text-secondary">
                  <Calendar size={16} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-medium leading-relaxed">
                    {item.duration}
                  </p>
                </div>
              </div>

              <div className={infoCard}>
                <div className="mb-4 flex items-center gap-2 text-maroonCustom">
                  <User size={18} />
                  <h3 className="text-sm font-black uppercase tracking-widest">
                    Workplace Supervisor
                  </h3>
                </div>

                <p className="text-lg font-bold text-maroon-dark">
                  {item.supervisor}
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-text-secondary">
                    <Mail size={16} className="shrink-0" />
                    <p className="text-sm font-medium break-all">
                      {item.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-text-secondary">
                    <Phone size={16} className="shrink-0" />
                    <p className="text-sm font-medium">{item.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-border/50 pt-8 md:flex-row">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#5B1E1E] px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.01]">
                <CheckCircle2 size={20} className="text-[#D4AF37]" />
                Approve Request
              </button>

              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#5B1E1E] bg-white px-8 py-4 font-bold text-[#5B1E1E] transition-colors hover:bg-red-50">
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
