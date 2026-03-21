import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Download } from "lucide-react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const reportCards = [
  {
    title: "Internship Placements",
    value: 120,
    description: "Active placements this month",
  },
  {
    title: "Evaluations Completed",
    value: 98,
    description: "Evaluations submitted",
  },
  {
    title: "Pending Reviews",
    value: 22,
    description: "Reports awaiting review",
  },
  {
    title: "Average Score",
    value: "82.5%",
    description: "Across all evaluations",
  },
];

const tableData = [];

const Reports = () => {
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-maroon dark:text-slate-300 sm:text-4xl">
            System Reports
          </h1>
          <p className="text-sm text-text-secondary dark:text-slate-300 sm:text-base lg:text-lg">
            Comprehensive analytics and reporting
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-maroonCustom px-5 py-2 font-semibold text-white shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {reportCards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8"
          >
            <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
              {card.title}
            </span>
            <span className="text-3xl font-extrabold text-green-600 dark:text-emerald-400 mb-2">
              {card.value}
            </span>
            <span className="text-sm text-text-secondary dark:text-slate-300">
              {card.description}
            </span>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-bold text-maroon dark:text-slate-300">
            Monthly Performance Trend
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select className="rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold">
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
            <select className="rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold">
              <option>All Programs</option>
              <option>BSc Computer Science</option>
              <option>BSc IT</option>
              <option>BSc Software Engineering</option>
            </select>
          </div>
        </div>
        <div className="rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:scale-102 sm:p-6 lg:p-8 xl:p-10">
          <p className="mb-2 text-sm sm:text-base dark:text-slate-300">
            Student enrollment and average scores by month
          </p>
          <div className="flex h-64 items-center justify-center dark:text-slate-300 sm:h-72">
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
                    label: "Enrollments",
                    data: [30, 45, 60, 50, 70, 80, 90, 100, 85, 75, 65, 55],
                    borderColor: "#800000",
                    backgroundColor: "rgba(128,0,0,0.1)",
                    tension: 0.4,
                  },
                  {
                    label: "Avg Score",
                    data: [70, 72, 75, 78, 80, 82, 85, 87, 86, 84, 83, 82],
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
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-bold text-maroon dark:text-slate-300">
            Detailed Report Table
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Search reports..."
              className="rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <select className="rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 px-4 py-2 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold">
              <option>Status: All</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8 lg:p-10">
          {tableData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-text-secondary dark:text-slate-300">
              <span className="text-lg font-semibold mb-2">
                No reports found
              </span>
              <span className="text-sm">
                Try adjusting your filters or date range.
              </span>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow index={0}>
                  <TableHeaderCell>Report Name</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Action</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx} index={idx}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      <button className="bg-maroon text-white px-3 py-1 rounded-lg font-semibold shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold">
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>
    </div>
  );
};

export default Reports;
