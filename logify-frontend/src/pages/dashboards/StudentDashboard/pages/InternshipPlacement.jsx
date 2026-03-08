import { Clock, MapPin, Building2, User, Phone, Mail } from "lucide-react";
import MetricCard from "../../../../components/ui/MetricCard";

const InternshipPlacement = () => {
  const metrics = [
    { title: "Placement Status", value: "Active", iconType: "placements" },
    { title: "Total Duration", value: "12 Weeks", iconType: "reviews" },
    { title: "Current Week", value: "Week 8", iconType: "reviews" },
    { title: "Days Remaining", value: "24 Days", iconType: "reviews" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-12 py-10 font-sans">
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black text-maroon-dark mb-3 tracking-tighter">
            Internship Placement
          </h1>
          <p className="text-lg text-text-secondary/80 max-w-lg leading-relaxed">
            View and manage your internship placement details and organization
            contact info.
          </p>
        </div>
        <button className="text-sm text-white font-bold hover:bg-red-800 transition-colors px-6 py-3 bg-maroonCustom rounded-xl shadow-sm">
          Edit Details
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {metrics.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            iconType={m.iconType}
          />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="bg-white rounded-[12px] p-10 border border-border transition-transform">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Organization Details
            </h2>
            <p className="text-text-secondary text-md mt-1">
              Host organization information and contact
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gold/10 rounded-xl text-gold">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-text-secondary/60 mb-1">
                  Organization Name
                </p>
                <p className="text-lg font-bold text-maroon-dark">
                  TechCorp Solutions Inc.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-gold/10 rounded-xl text-gold">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-text-secondary/60 mb-1">
                  Physical Address
                </p>
                <p className="text-lg font-bold text-maroon-dark leading-snug">
                  456 Innovation Drive, Tech Park,
                  <br />
                  Silicon Valley, CA 94025
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 p-2">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-2 bg-gold/5 rounded-lg text-gold">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-text-secondary/60 mb-1">
                    Contact
                  </p>
                  <p className="text-sm font-bold text-maroon-dark">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-text-secondary/60 mb-1">
                    Email
                  </p>
                  <p className="text-sm font-bold text-maroon-dark truncate">
                    contact@techcorp.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[12px] p-10 border border-border transition-transform">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Supervisor Records
            </h2>
            <p className="text-text-secondary text-md mt-1">
              Assigned workplace and academic mentors
            </p>
          </div>

          <div className="space-y-8">
            <div className="p-6 bg-background/50 rounded-[12px] border border-gray-200">
              <div className="flex mb-4">
                <div className="h-12 w-12 rounded-full bg-maroon-dark flex items-center ">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-maroon-dark">
                    Michael Chen
                  </h3>
                  <p className="text-[10px] uppercase font-bold text-maroonCustom tracking-widest">
                    Workplace Supervisor
                  </p>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 text-sm font-semibold text-text-secondary">
                <div className="mb-4">
                  <p className="text-[10px] uppercase text-text-secondary/40 mb-1">
                    Position
                  </p>
                  <p className="text-maroon-dark">Senior SE</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-text-secondary/40 mb-1">
                    Email
                  </p>
                  <p className="text-maroon-dark truncate">
                    m.chen@techcorp.com
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gold/5 rounded-[12px] border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center text-maroon-dark">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Dr. Emily Roberts</h3>
                  <p className="text-[10px] uppercase font-bold text-maroonCustom tracking-widest">
                    Academic Supervisor
                  </p>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 text-sm font-semibold text-text-secondary">
                <div className="mb-4">
                  <p className="text-[10px] uppercase text-text-secondary/40 mb-1">
                    Department
                  </p>
                  <p className="text-maroon-dark">Comp Sci</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-text-secondary/40 mb-1">
                    Email
                  </p>
                  <p className="text-maroon-dark truncate">
                    e.roberts@university.edu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="bg-white rounded-[12px] p-10 border border-border">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-maroon-dark tracking-tight">
              Status Timeline
            </h2>
            <p className="text-text-secondary text-md mt-1">
              History of your placement status changes
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Internship Started",
                desc: "Your internship has officially begun at TechCorp Solutions Inc.",
                time: "2 days ago",
              },
              {
                title: "Placement Approved",
                desc: "Dr. Emily Roberts approved your internship placement",
                time: "4 days ago",
              },
              {
                title: "Placement Submitted",
                desc: "You submitted your placement details for review",
                time: "1 week ago",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-6 p-5 bg-background/50 rounded-[12px] border border-border/30 hover:bg-background transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <Clock size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-md font-bold text-maroon-dark">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {activity.desc}
                  </p>
                </div>
                <div className="text-md font-bold text-text-secondary/50 uppercase tracking-tighter">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InternshipPlacement;
