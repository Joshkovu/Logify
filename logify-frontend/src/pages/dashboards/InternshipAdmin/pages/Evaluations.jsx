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
    <div className="w-full min-h-screen ml-5">
      <h1 className="text-2xl text-black pb-3">Evaluation Overview</h1>
      <p className="pb-3">Monitor all student evaluations across the system </p>
      <section className="flex mb-5">
        <div className="w-1/4 border  p-3 mr-3 rounded-lg shadow-md border-gray-300">
          <h1>Total Evaluations</h1>
          <span>156</span>
        </div>
        <div className="w-1/4 border p-3 mr-3 rounded-lg shadow-md border-gray-300">
          <h1>Completed </h1>
          <span>142</span>
        </div>
        <div className="w-1/4 border  p-3 mr-3 rounded-lg shadow-md border-gray-300">
          <h1>Pending</h1>
          <span>14</span>
        </div>
        <div className="w-1/4 border p-3 mr-3 rounded-lg shadow-md border-gray-300">
          <h1>Average Score</h1>
          <span>84.2%</span>
        </div>
      </section>
      <section>
        <h1 className="text-2xl mb-3">Recent Evaluations</h1>
        <p className="text-xl mb-3 ">Latest completed evaluations</p>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Student</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Evaluator</TableHeaderCell>
              <TableHeaderCell>Score</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evaluations.map((evaln, idx) => (
              <TableRow key={idx}>
                <TableCell>{evaln.student}</TableCell>
                <TableCell>{evaln.type}</TableCell>
                <TableCell>{evaln.evaluator}</TableCell>
                <TableCell>{evaln.score}</TableCell>
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
