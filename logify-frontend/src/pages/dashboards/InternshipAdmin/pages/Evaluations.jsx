import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../../../components/ui/table";
import { evaluations } from "./evaluations-data";

const Evaluations = () => {
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-10 py-8  font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-maroon mb-2 tracking-tight">
          Evaluation Overview
        </h1>
        <p className="text-lg text-text-secondary">
          Monitor all student evaluations across the system
        </p>
      </header>
      <section className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Total Evaluations
          </span>
          <span className="text-3xl font-extrabold text-green-500">156</span>
        </div>
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Completed
          </span>
          <span className="text-3xl font-extrabold text-blue-600">142</span>
        </div>
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Pending
          </span>
          <span className="text-3xl font-extrabold text-amber-500">14</span>
        </div>
        <div className="bg-white rounded-[12px] p-10   hover:scale-102 transition-all  flex flex-col items-center border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Average Score
          </span>
          <span className="text-3xl font-extrabold text-blue-700">84.2%</span>
        </div>
      </section>
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-maroon mb-1">
              Recent Evaluations
            </h2>
            <p className="text-text-secondary">Latest completed evaluations</p>
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow index={0}>
              <TableHeaderCell>Student</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Evaluator</TableHeaderCell>
              <TableHeaderCell>Score</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evaluations.map((evaln, idx) => (
              <TableRow key={idx} index={idx}>
                <TableCell>{evaln.student}</TableCell>
                <TableCell>{evaln.type}</TableCell>
                <TableCell>{evaln.evaluator}</TableCell>
                <TableCell className="text-blue-600">{evaln.score}</TableCell>
                <TableCell>{evaln.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default Evaluations;
