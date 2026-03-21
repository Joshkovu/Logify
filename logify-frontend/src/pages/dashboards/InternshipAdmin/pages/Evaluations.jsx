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
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-maroon dark:text-gold sm:text-4xl">
          Evaluation Overview
        </h1>
        <p className="text-sm text-text-secondary dark:text-slate-300 sm:text-base lg:text-lg">
          Monitor all student evaluations across the system
        </p>
      </header>
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Total Evaluations
          </span>
          <span className="text-3xl font-extrabold text-green-500 dark:text-emerald-400">
            156
          </span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Completed
          </span>
          <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            142
          </span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Pending
          </span>
          <span className="text-3xl font-extrabold text-amber-500 dark:text-amber-300">
            14
          </span>
        </div>
        <div className="flex flex-col items-center rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-all hover:scale-102 sm:p-8">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-slate-300 tracking-widest mb-1">
            Average Score
          </span>
          <span className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            84.2%
          </span>
        </div>
      </section>
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-maroon dark:text-gold mb-1">
              Recent Evaluations
            </h2>
            <p className="text-text-secondary dark:text-slate-300">
              Latest completed evaluations
            </p>
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
                <TableCell className="text-blue-600 dark:text-blue-400">
                  {evaln.score}
                </TableCell>
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
