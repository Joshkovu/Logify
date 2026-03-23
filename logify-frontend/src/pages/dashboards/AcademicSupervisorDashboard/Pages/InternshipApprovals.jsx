import { useMemo, useState } from "react";
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

const initialApprovals = [
  {
    id: 1,
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
    id: 2,
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
  "rounded-[12px] border border-border bg-white p-10 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-900";

const infoCard =
  "rounded-2xl border border-border/30 bg-[#FCFBF8] p-6 dark:border-slate-700 dark:bg-slate-800";

const sectionLabel =
  "text-[10px] font-black uppercase tracking-widest text-text-secondary/50 dark:text-slate-400";

const InternshipApprovals = () => {
  const [pendingApprovals, setPendingApprovals] = useState(initialApprovals);
  const [approvedApprovals, setApprovedApprovals] = useState([
    {
      id: 101,
      name: "John Doe",
      regNo: "2024001999",
      program: "Software Engineering",
      submittedOn: "Feb 10, 2026",
      organization: "CodeBase Africa",
      address: "12 Innovation Road, Nairobi",
      position: "Frontend Intern",
      duration: "Feb 15, 2026 - May 20, 2026",
      supervisor: "Alice Brown",
      email: "alice@codebase.africa",
      phone: "+254 700 111 222",
      status: "Approved",
      actionDate: "Feb 12, 2026",
    },
    {
      id: 102,
      name: "Grace Miller",
      regNo: "2024001888",
      program: "Information Systems",
      submittedOn: "Feb 05, 2026",
      organization: "TechNova",
      address: "44 Silicon Avenue, Cape Town",
      position: "Systems Analyst Intern",
      duration: "Feb 12, 2026 - May 18, 2026",
      supervisor: "Daniel Smith",
      email: "daniel@technova.com",
      phone: "+27 600 123 456",
      status: "Approved",
      actionDate: "Feb 08, 2026",
    },
    {
      id: 103,
      name: "Peter Adams",
      regNo: "2024001777",
      program: "Computer Science",
      submittedOn: "Jan 28, 2026",
      organization: "DataSphere",
      address: "8 Market Street, Lagos",
      position: "Backend Intern",
      duration: "Feb 02, 2026 - May 10, 2026",
      supervisor: "Linda Jones",
      email: "linda@datasphere.com",
      phone: "+234 800 555 1111",
      status: "Approved",
      actionDate: "Jan 30, 2026",
    },
    {
      id: 104,
      name: "Naomi Reed",
      regNo: "2024001666",
      program: "Cyber Security",
      submittedOn: "Jan 20, 2026",
      organization: "SecureNet",
      address: "17 Security Park, Accra",
      position: "Security Analyst Intern",
      duration: "Jan 27, 2026 - May 01, 2026",
      supervisor: "Chris Ford",
      email: "chris@securenet.com",
      phone: "+233 20 123 4567",
      status: "Approved",
      actionDate: "Jan 23, 2026",
    },
    {
      id: 105,
      name: "Helen Brooks",
      regNo: "2024001555",
      program: "Data Science",
      submittedOn: "Jan 15, 2026",
      organization: "Insight Labs",
      address: "90 Lake Drive, Kampala",
      position: "Data Analyst Intern",
      duration: "Jan 22, 2026 - Apr 30, 2026",
      supervisor: "Peter White",
      email: "peter@insightlabs.com",
      phone: "+256 700 765 432",
      status: "Approved",
      actionDate: "Jan 18, 2026",
    },
    {
      id: 106,
      name: "Samuel Green",
      regNo: "2024001444",
      program: "Computer Engineering",
      submittedOn: "Jan 10, 2026",
      organization: "CircuitWorks",
      address: "5 Hardware Street, Kigali",
      position: "Embedded Systems Intern",
      duration: "Jan 17, 2026 - Apr 25, 2026",
      supervisor: "Rita Cole",
      email: "rita@circuitworks.com",
      phone: "+250 788 111 999",
      status: "Approved",
      actionDate: "Jan 12, 2026",
    },
    {
      id: 107,
      name: "Irene Scott",
      regNo: "2024001333",
      program: "Software Engineering",
      submittedOn: "Jan 05, 2026",
      organization: "CloudAxis",
      address: "200 Server Lane, Johannesburg",
      position: "Cloud Support Intern",
      duration: "Jan 12, 2026 - Apr 20, 2026",
      supervisor: "Tom Hall",
      email: "tom@cloudaxis.com",
      phone: "+27 71 222 8888",
      status: "Approved",
      actionDate: "Jan 08, 2026",
    },
    {
      id: 108,
      name: "Brian Young",
      regNo: "2024001222",
      program: "Information Technology",
      submittedOn: "Dec 28, 2025",
      organization: "NextWave Digital",
      address: "31 Creative Hub, Mombasa",
      position: "IT Support Intern",
      duration: "Jan 04, 2026 - Apr 15, 2026",
      supervisor: "Eva Moore",
      email: "eva@nextwave.com",
      phone: "+254 711 222 444",
      status: "Approved",
      actionDate: "Dec 30, 2025",
    },
  ]);
  const [declinedApprovals, setDeclinedApprovals] = useState([]);

  const stats = useMemo(() => {
    const pendingCount = pendingApprovals.length;
    const approvedCount = approvedApprovals.length;
    const totalProcessed = approvedApprovals.length + declinedApprovals.length;
    const rate =
      totalProcessed === 0
        ? 100
        : Math.round((approvedApprovals.length / totalProcessed) * 100);

    return [
      {
        title: "Pending Approvals",
        value: String(pendingCount),
        iconType: "placements",
      },
      {
        title: "Approved This Month",
        value: String(approvedCount),
        iconType: "evaluations",
      },
      {
        title: "Approval Rate",
        value: `${rate}%`,
        iconType: "reviews",
      },
    ];
  }, [pendingApprovals, approvedApprovals, declinedApprovals]);

  const handleApprove = (item) => {
    const approvedItem = {
      ...item,
      status: "Approved",
      actionDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    setApprovedApprovals((prev) => [approvedItem, ...prev]);
    setPendingApprovals((prev) =>
      prev.filter((approval) => approval.id !== item.id),
    );
  };

  const handleDecline = (item) => {
    const declinedItem = {
      ...item,
      status: "Declined",
      actionDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    setDeclinedApprovals((prev) => [declinedItem, ...prev]);
    setPendingApprovals((prev) =>
      prev.filter((approval) => approval.id !== item.id),
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans text-[#1e1e1e] dark:bg-black dark:text-white">
      <header className="mb-12">
        <h1 className="mb-3 text-5xl font-black tracking-tighter text-maroon-dark dark:text-white">
          Internship <span className="text-gold">Approvals</span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-text-secondary/80 dark:text-slate-300">
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
        {pendingApprovals.length > 0 ? (
          pendingApprovals.map((item) => (
            <div key={item.id} className={pageCard}>
              <div className="mb-8 flex flex-col gap-6 border-b border-border/50 pb-8 dark:border-slate-700 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-2xl font-black text-gold">
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-black tracking-tight text-maroon-dark dark:text-white">
                        {item.name}
                      </h2>

                      <div className="flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5">
                        <Clock size={16} className="text-gold" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gold">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm font-bold uppercase tracking-widest text-text-secondary/60 dark:text-slate-400">
                      Reg: {item.regNo} &bull; {item.program}
                    </p>

                    <div className="mt-4">
                      <p className={sectionLabel}>Submission Date</p>
                      <p className="mt-1 text-sm font-bold text-maroon-dark dark:text-white">
                        {item.submittedOn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-10 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className={infoCard}>
                  <div className="mb-4 flex items-center gap-2 text-maroonCustom dark:text-gold">
                    <Building2 size={18} />
                    <h3 className="text-sm font-black uppercase tracking-widest">
                      Organization Details
                    </h3>
                  </div>

                  <p className="text-lg font-bold text-maroon-dark dark:text-white">
                    {item.organization}
                  </p>

                  <div className="mt-4 flex items-start gap-3 text-text-secondary dark:text-slate-300">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <p className="text-sm font-medium leading-relaxed">
                      {item.address}
                    </p>
                  </div>
                </div>

                <div className={infoCard}>
                  <div className="mb-4 flex items-center gap-2 text-maroonCustom dark:text-gold">
                    <Briefcase size={18} />
                    <h3 className="text-sm font-black uppercase tracking-widest">
                      Placement Specifics
                    </h3>
                  </div>

                  <p className="text-lg font-bold text-maroon-dark dark:text-white">
                    {item.position}
                  </p>

                  <div className="mt-4 flex items-start gap-3 text-text-secondary dark:text-slate-300">
                    <Calendar size={16} className="mt-0.5 shrink-0" />
                    <p className="text-sm font-medium leading-relaxed">
                      {item.duration}
                    </p>
                  </div>
                </div>

                <div className={infoCard}>
                  <div className="mb-4 flex items-center gap-2 text-maroonCustom dark:text-gold">
                    <User size={18} />
                    <h3 className="text-sm font-black uppercase tracking-widest">
                      Workplace Supervisor
                    </h3>
                  </div>

                  <p className="text-lg font-bold text-maroon-dark dark:text-white">
                    {item.supervisor}
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-text-secondary dark:text-slate-300">
                      <Mail size={16} className="shrink-0" />
                      <p className="text-sm font-medium break-all">
                        {item.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-text-secondary dark:text-slate-300">
                      <Phone size={16} className="shrink-0" />
                      <p className="text-sm font-medium">{item.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border/50 pt-8 dark:border-slate-700 md:flex-row">
                <button
                  onClick={() => handleApprove(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#5B1E1E] px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.01] dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  <CheckCircle2
                    size={20}
                    className="text-[#D4AF37] dark:text-white"
                  />
                  Approve Request
                </button>

                <button
                  onClick={() => handleDecline(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#5B1E1E] bg-white px-8 py-4 font-bold text-[#5B1E1E] transition-colors hover:bg-red-50 dark:border-red-500 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <XCircle size={20} />
                  Decline Request
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[12px] border border-border bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-lg font-semibold text-text-secondary dark:text-slate-300">
              No pending internship approvals at the moment.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default InternshipApprovals;
