const Evaluation = () => {
  const pendingEvaluation = {
    name: "Sarah Johnson",
    type: "Mid-Term Evaluation",
    company: "TechCorp Solutions Inc.",
    status: "In Progress",
    program: "Computer Science",
    week: "Week 8 of 12",
    score: 86,
  };

  const criteria = [
    {
      title: "Technical Skills",
      weight: "30%",
      score: 88,
      note: "Ability to apply technical knowledge and skills",
      contribution: "26%",
    },
    {
      title: "Communication",
      weight: "20%",
      score: 85,
      note: "Written and verbal communication effectiveness",
      contribution: "17%",
    },
    {
      title: "Professionalism",
      weight: "20%",
      score: 90,
      note: "Work ethic and professional conduct",
      contribution: "18%",
    },
    {
      title: "Initiative",
      weight: "15%",
      score: 82,
      note: "Self-motivation and proactive approach",
      contribution: "12%",
    },
    {
      title: "Problem Solving",
      weight: "15%",
      score: 85,
      note: "Analytical thinking and solution development",
      contribution: "13%",
    },
  ];

  const completedEvaluations = [
    {
      name: "Robert Kim",
      type: "Mid-Term Evaluation",
      company: "DataTech Analytics",
      date: "Completed Feb 18, 2026",
      score: "88%",
    },
    {
      name: "Lisa Wang",
      type: "Mid-Term Evaluation",
      company: "CloudNet Systems",
      date: "Completed Feb 12, 2026",
      score: "92%",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f7f5f2] px-6 py-6">
      <h1 className="mb-3 text-4xl font-bold">Student Evaluations</h1>
      <p className="mb-8 max-w-2xl text-xl text-gray-600">
        Evaluate intern performance and submit scores
      </p>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Pending Evaluations</h2>
        <p className="mt-2 text-gray-500">Students requiring evaluation</p>

        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold">
                {pendingEvaluation.name} - {pendingEvaluation.type}
              </h3>
              <p className="mt-2 text-xl text-gray-600">
                {pendingEvaluation.company}
              </p>
            </div>

            <span className="text-2xl font-medium text-blue-600">
              {pendingEvaluation.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">
              {pendingEvaluation.type} - {pendingEvaluation.name}
            </h2>
            <p className="mt-2 text-xl text-gray-500">
              {pendingEvaluation.program} • {pendingEvaluation.week}
            </p>
          </div>

          <div className="text-right">
            <div className="text-5xl font-bold text-blue-600">
              {pendingEvaluation.score}%
            </div>
            <p className="mt-2 text-gray-500">Auto-calculated score</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-6 text-2xl font-semibold">Evaluation Criteria</h3>

          <div className="space-y-8">
            {criteria.map((item) => (
              <div key={item.title}>
                <div className="flex items-start justify-between gap-4">
                  <div className="max-w-[55%]">
                    <h4 className="text-2xl font-semibold">
                      {item.title}{" "}
                      <span className="font-normal text-gray-500">
                        ({item.weight} weight)
                      </span>
                    </h4>
                    <p className="mt-2 text-xl text-gray-600">{item.note}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl">{item.score} / 100</p>
                  </div>
                </div>

                <div className="mt-4 h-4 w-full rounded-full bg-[#ead7da]">
                  <div
                    className="h-4 rounded-full bg-[#8d1726]"
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <p className="mt-2 text-lg text-gray-500">
                  Weighted contribution: {item.contribution}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-3xl font-semibold">Final Weighted Score</h3>
            <div className="text-5xl font-bold text-blue-600">
              {pendingEvaluation.score}%
            </div>
          </div>

          <div className="mt-5 h-5 w-full rounded-full bg-[#ead7da]">
            <div className="h-5 w-[86%] rounded-full bg-[#8d1726]" />
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2 text-center text-sm text-gray-600">
            <div>
              <p>Techni...</p>
              <p className="text-2xl font-medium text-black">26%</p>
            </div>
            <div>
              <p>Comm...</p>
              <p className="text-2xl font-medium text-black">17%</p>
            </div>
            <div>
              <p>Profes...</p>
              <p className="text-2xl font-medium text-black">18%</p>
            </div>
            <div>
              <p>Initiative</p>
              <p className="text-2xl font-medium text-black">12%</p>
            </div>
            <div>
              <p>Proble...</p>
              <p className="text-2xl font-medium text-black">13%</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold">Overall Comments & Feedback</h3>

          <textarea
            placeholder="Provide detailed feedback on the student's performance..."
            className="mt-4 min-h-45 w-full resize-none border-0 bg-transparent text-2xl text-gray-500 outline-none"
          />
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="flex justify-end">
            <button className="rounded-xl bg-blue-600 px-8 py-4 text-2xl font-medium text-white">
              Submit Evaluation
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Completed Evaluations</h2>
        <p className="mt-2 max-w-xl text-xl text-gray-500">
          Previously submitted evaluations this semester
        </p>

        <div className="mt-6 space-y-4">
          {completedEvaluations.map((item) => (
            <div key={item.name} className="rounded-2xl border bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold">
                    {item.name} - {item.type}
                  </h3>
                  <p className="mt-2 text-xl text-gray-600">
                    {item.company} • {item.date}
                  </p>
                </div>

                <div className="text-4xl font-bold text-green-500">
                  {item.score}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Evaluation;