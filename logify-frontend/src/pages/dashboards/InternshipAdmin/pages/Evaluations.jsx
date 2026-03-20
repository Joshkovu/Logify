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
    <div className="min-h-screen w-full bg-[#FCFBF8] px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-maroon sm:text-4xl">
          Evaluation Overview
        </h1>
        <p className="text-sm text-text-secondary sm:text-base lg:text-lg">
          Monitor all student evaluations across the system
        </p>
      </header>
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        <div className="flex flex-col items-center rounded-[12px] border border-border bg-white p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Total Evaluations
          </span>
          <span className="text-3xl font-extrabold text-green-500">156</span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border bg-white p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Completed
          </span>
          <span className="text-3xl font-extrabold text-blue-600">142</span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border bg-white p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary tracking-widest mb-1">
            Pending
          </span>
          <span className="text-3xl font-extrabold text-amber-500">14</span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border bg-white p-6 transition-all hover:scale-102 sm:p-8">
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
