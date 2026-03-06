const Reports = () => {
  const stats = [
    {
      title: "Total Interns",
      value: "15",
      subtitle: "This semester",
      color: "text-black",
    },
    {
      title: "Average Score",
      value: "86.6%",
      subtitle: "Across all evaluations",
      color: "text-blue-600",
    },
    {
      title: "Completion Rate",
      value: "95%",
      subtitle: "Successfully completed",
      color: "text-green-500",
    },
    {
      title: "Active Placements",
      value: "5",
      subtitle: "Currently ongoing",
      color: "text-orange-500",
    },
  ];

  const students = [
    {
      name: "Sarah Johnson",
      organization: "TechCorp Solutions",
      progress: "Week 8/12",
    },
    {
      name: "Robert Kim",
      organization: "DataTech Analytics",
      progress: "Week 10/12",
    },
    {
      name: "Lisa Wang",
      organization: "CloudNet Systems",
      progress: "Week 6/12",
    },
    {
      name: "David Chen",
      organization: "FinTech Corp",
      progress: "Not Started",
    },
    {
      name: "Maria Garcia",
      organization: "InnovateTech",
      progress: "Not Started",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f7f5f2] px-6 py-6">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold leading-tight">Reports & Analytics</h1>
          <p className="mt-3 max-w-md text-xl text-gray-600">
            View comprehensive reports on intern performance
          </p>
        </div>

        <button className="rounded-xl border bg-white px-6 py-4 text-xl shadow-sm">
          Export Report
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h3 className="text-2xl text-gray-500">{stat.title}</h3>
            <div className={`mt-10 text-5xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="mt-3 text-xl text-gray-600">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Student Performance Overview</h2>
        <p className="mt-2 text-xl text-gray-500">
          Mid-term evaluation scores
        </p>

        <div className="mt-6 h-56 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-xl">
          Graph goes here
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Internship Status Distribution</h2>
        <p className="mt-2 text-xl text-gray-500">
          Current status breakdown
        </p>

        <div className="mt-6 h-56 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-xl">
          Graph goes here
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Monthly Completion Rates</h2>
        <p className="mt-2 text-xl text-gray-500">
          Successful internship completion by month
        </p>

        <div className="mt-6 h-56 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-xl">
          Graph goes here
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Detailed Performance Breakdown</h2>
        <p className="mt-2 max-w-xl text-xl text-gray-500">
          Comprehensive view of all supervised interns
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-2xl font-semibold">Student</th>
                <th className="pb-4 text-2xl font-semibold">Organization</th>
                <th className="pb-4 text-2xl font-semibold">Progress</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.name} className="border-b last:border-b-0">
                  <td className="py-6 text-2xl text-gray-700">{student.name}</td>
                  <td className="py-6 text-2xl text-gray-500">
                    {student.organization}
                  </td>
                  <td className="py-6 text-2xl text-gray-500">
                    {student.progress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;