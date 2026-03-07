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
    <div className="min-h-screen w-full bg-[#FCFBF8] px-10 py-8  font-sans">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-maroon mb-2 tracking-tight">
            System Reports
          </h1>
          <p className="text-lg text-text-secondary">
            Comprehensive analytics and reporting
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-maroon text-black px-5 py-2 rounded-lg font-semibold shadow hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold">
            Export PDF
          </button>
          <button className="bg-gold text-maroon-dark px-5 py-2 rounded-lg font-semibold shadow hover:bg-gold/80 focus:outline-none focus:ring-2 focus:ring-maroon">
            Export Excel
          </button>
        </div>
      </header>

      <section className="grid grid-cols-4 gap-6 mb-10">
        {reportCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border"
          >
            <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
              {card.title}
            </span>
            <span className="text-3xl font-extrabold text-green-600 mb-2">
              {card.value}
            </span>
            <span className="text-sm text-text-secondary">
              {card.description}
            </span>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-maroon">
            Monthly Performance Trend
          </h2>
          <div className="flex gap-2">
            <select className="border border-border rounded-lg px-4 py-2 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-gold">
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
            <select className="border border-border rounded-lg px-4 py-2 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-gold">
              <option>All Programs</option>
              <option>BSc Computer Science</option>
              <option>BSc IT</option>
              <option>BSc Software Engineering</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  border border-border">
          <p className="text-md mb-2">
            Student enrollment and average scores by month
          </p>
          <div className="h-64 flex items-center justify-center">
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-maroon">
            Detailed Report Table
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search reports..."
              className="border border-border rounded-lg px-4 py-2 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <select className="border border-border rounded-lg px-4 py-2 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-gold">
              <option>Status: All</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border">
          {tableData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-text-secondary">
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
