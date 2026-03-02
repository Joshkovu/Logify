const Evaluations = () => {
  return (
    <div className="w-full min-h-screen">
      <h1>Evaluation Overview</h1>
      <p>Monitor all student evaluations across the system </p>
      <section className="flex">
        <div className="w-1/4 border-gray-100">
          <h1>Total Evaluations</h1>
          <span>156</span>
        </div>
        <div className="w-1/4 border-gray-100 ">
          <h1>Completed </h1>
          <span>142</span>
        </div>
        <div className="w-1/4 border-gray-100">
          <h1>Pending</h1>
          <span>14</span>
        </div>
        <div className="w-1/4">
          <h1>Average Score</h1>
          <span>84.2%</span>
        </div>
      </section>
      <section>
        <h1>Recent Evaluations</h1>
        <p>Latest completed evaluations</p>
        <div className="grid grid-cols-4">
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
