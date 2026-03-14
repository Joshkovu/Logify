import MetricCard from "../../../../components/ui/MetricCard";
import { TrendingUp, FileDown } from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const stats = [
  {
    title: "Total Interns",
    value: "15",
    iconType: "interns",
  },
  {
    title: "Average Score",
    value: "86.6%",
    iconType: "reviews",
  },
  {
    title: "Completion Rate",
    value: "95%",
    iconType: "evaluations",
  },
  {
    title: "Active Placements",
    value: "5",
    iconType: "placements",
  },
];

const students = [
  {
    name: "Sarah Johnson",
    organization: "TechCorp Solutions",
    progress: "Week 8/12",
    status: "Active",
    score: 85,
  },
  {
    name: "Robert Kim",
    organization: "DataTech Analytics",
    progress: "Week 10/12",
    status: "Active",
    score: 88,
  },
  {
    name: "Lisa Wang",
    organization: "CloudNet Systems",
    progress: "Week 6/12",
    status: "Active",
    score: 92,
  },
  {
    name: "David Chen",
    organization: "FinTech Corp",
    progress: "Not Started",
    status: "Pending",
    score: 0,
  },
  {
    name: "Maria Garcia",
    organization: "InnovateTech",
    progress: "Not Started",
    status: "Pending",
    score: 0,
  },
];

const Reports = () => {
  const activeCount = students.filter(
    (student) => student.status === "Active",
  ).length;
  const pendingCount = students.filter(
    (student) => student.status === "Pending",
  ).length;

  const performanceChartData = {
    labels: students.map((student) => student.name),
    datasets: [
      {
        label: "Score",
        data: students.map((student) => student.score),
        backgroundColor: [
          "#7A1C1C",
          "#8B2323",
          "#9C2A2A",
          "#D6D3D1",
          "#E7E5E4",
        ],
        borderRadius: 10,
        barThickness: 36,
      },
    ],
  };

  const performanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f1f1f",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
            weight: "600",
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: "#6B7280",
          stepSize: 20,
          callback: function (value) {
            return `${value}%`;
          },
          font: {
            size: 11,
            weight: "600",
          },
        },
        grid: {
          color: "rgba(0,0,0,0.06)",
          drawBorder: false,
        },
      },
    },
  };

  const statusChartData = {
    labels: ["Active", "Pending"],
    datasets: [
      {
        data: [activeCount, pendingCount],
        backgroundColor: ["#7A1C1C", "#D4AF37"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#6B7280",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
            weight: "700",
          },
        },
      },
      tooltip: {
        backgroundColor: "#1f1f1f",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-[#FCFCFA] px-12 py-10 font-sans">
      <header className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="mb-3 text-5xl font-black tracking-tighter text-maroon-dark">
            Reports & <span className="text-gold">Analytics</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-text-secondary/80">
            Gain deep insights into intern performance, placement trends, and
            academic milestones.
          </p>
        </div>

        <button className="flex items-center gap-3 rounded-xl border border-[#7A1C1C] bg-gradient-to-r from-[#7A1C1C] to-[#8B2323] px-8 py-4 font-bold text-white shadow-lg shadow-[#7A1C1C]/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:from-[#6B1818] hover:to-[#7A1C1C]">
          <FileDown size={20} className="text-white" />
          Export Semester Report
        </button>
      </header>

      <section className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            iconType={stat.iconType}
          />
        ))}
      </section>

      <section className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-[12px] border border-border bg-[#FEFEFC] p-10 lg:col-span-2">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-maroonCustom/10 p-2 text-maroonCustom">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-maroon-dark">
              Performance Overview
            </h2>
          </div>

          <div className="h-64 rounded-3xl border border-border/50 bg-[#FBFBF8] p-4">
            <Bar
              data={performanceChartData}
              options={performanceChartOptions}
            />
          </div>
        </div>

        <div className="rounded-[12px] border border-border bg-[#FEFEFC] p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-gold/10 p-2 text-gold">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-maroon-dark">
              Status Distribution
            </h2>
          </div>

          <div className="h-64 rounded-3xl border border-border/50 bg-[#FBFBF8] p-4">
            <Doughnut data={statusChartData} options={statusChartOptions} />
          </div>
        </div>
      </section>

      <section className="rounded-[12px] border border-border bg-[#FEFEFC] p-10">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-maroon-dark">
              Detailed Performance Breakdown
            </h2>
            <p className="mt-1 text-md font-medium italic text-text-secondary opacity-60">
              Full list of supervised interns and their current academic
              standing
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/50">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 bg-[#FAFAF7]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60">
                  Student
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60">
                  Organization
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60">
                  Progress
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60">
                  Score
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-maroon-dark/60">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/30">
              {students.map((student) => (
                <tr
                  key={student.name}
                  className="group transition-colors hover:bg-[#FBFBF8]"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-maroonCustom/5 text-sm font-bold text-maroonCustom">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-md font-bold text-maroon-dark">
                        {student.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-sm font-medium text-text-secondary">
                    {student.organization}
                  </td>

                  <td className="px-8 py-6 text-sm font-bold tracking-tight text-gold">
                    {student.progress}
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-md font-black ${
                          student.score >= 90
                            ? "text-emerald-600"
                            : "text-maroon-dark"
                        }`}
                      >
                        {student.score > 0 ? `${student.score}%` : "—"}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <span
                      className={`rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                        student.status === "Active"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                          : "border-gold/10 bg-gold/5 text-gold group-hover:bg-gold/10"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Reports;
