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
        <div className="grid grid-cols-5">
          <div>
            <h1>Student</h1>
            {/* Placeholder for student names */}
          </div>
          <div>
            <h1>Type</h1>
            {/* Placeholder for evaluation types */}
          </div>
          <div>
            <h1>Evaluator</h1>
            {/* Placeholder for evaluator names */}
          </div>
          <div>
            <h1>Score</h1>
            {/* Placeholder for scores */}
          </div>
          <div>
            <h1>Date</h1>
            {/* Placeholder for evaluation dates */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Evaluations;
