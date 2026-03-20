import { Clock } from "lucide-react";
import MetricCard from "../../../../components/ui/MetricCard";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const metrics = [
  { title: "Total Interns", value: 427, iconType: "interns" },
  { title: "Active Placements", value: 15, iconType: "placements" },
  { title: "Pending Reviews", value: 23, iconType: "reviews" },
  { title: "Completed Evaluations", value: 300, iconType: "evaluations" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
      <header className="mb-8 sm:mb-10 lg:mb-12">
        <div className="flex items-center gap-3 mb-2"></div>
        <h1 className="mb-3 text-3xl font-black tracking-tighter text-maroon-dark sm:text-4xl lg:text-5xl">
          Internship Admin <span className="text-gold">Dashboard</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary/80 sm:text-base lg:text-lg">
          Monitor and manage your internship programs with comprehensive data
          and real-time tracking.
        </p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 xl:gap-8">
        {metrics.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            iconType={m.iconType}
          />
        ))}
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-[12px] border border-border bg-white p-4 transition-all hover:scale-102 sm:p-6 lg:p-8 xl:p-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-tight text-maroon-dark sm:text-2xl">
                Score Distribution
              </h2>
              <p className="mt-1 text-sm text-text-secondary sm:text-base">
                Final evaluation scores breakdown for current batch
              </p>
            </div>
            <div className="w-fit rounded-full bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gold sm:text-sm">
              Live
            </div>
          </div>
          <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-border/60 bg-gray-50/50 p-2 sm:h-64">
            <Bar
              data={{
                labels: ["0-49", "50-59", "60-69", "70-79", "80-89", "90-100"],
                datasets: [
                  {
                    label: "Students",
                    data: [5, 12, 25, 40, 30, 8],
                    backgroundColor: "#800000",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
        <div className="rounded-[12px] border border-border bg-white p-4 transition-all hover:scale-102 sm:p-6 lg:p-8 xl:p-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-tight text-maroon-dark sm:text-2xl">
                Placement Trends
              </h2>
              <p className="mt-1 text-sm text-text-secondary sm:text-base">
                Monthly growth in internship applications
              </p>
            </div>
            <div className="w-fit rounded-full bg-maroon/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-maroon sm:text-sm">
              Monthly
            </div>
          </div>
          <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-border/60 bg-gray-50/50 p-2 sm:h-64">
            <Line
              data={{
                labels: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                datasets: [
                  {
                    label: "Placements",
                    data: [2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3],
                    borderColor: "#FFD700",
                    backgroundColor: "rgba(255,215,0,0.1)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="w-full rounded-[12px] border border-border bg-white p-4 transition-transform hover:scale-101 sm:p-6 lg:p-8 xl:p-10">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black tracking-tight text-maroon-dark sm:text-2xl">
              Recent System Activity
            </h2>
            <button className="w-full rounded-lg border border-gold/10 bg-gold/5 px-4 py-2 text-xs font-bold text-gold transition-colors hover:text-maroon sm:w-auto">
              View All logs
            </button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col items-start gap-3 rounded-2xl border border-border/30 bg-background/50 p-4 transition-colors hover:bg-background sm:flex-row sm:items-center sm:gap-5 sm:p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <Clock size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-maroon-dark sm:text-base">
                    New student registration processed
                  </h3>
                  <p className="text-sm text-text-secondary mt-0.5">
                    Student ID #STR-2024-00{i} was successfully added to the
                    registry
                  </p>
                </div>
                <div className="text-xs font-bold uppercase tracking-wide text-text-secondary/50 sm:text-sm">
                  {i * 2} mins ago
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
