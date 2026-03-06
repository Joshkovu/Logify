const Dashboard = () => {
  const summaryCards = [
    {
      title: "Interns Supervised",
      value: "5",
      subtitle: "Currently assigned",
      icon: "👥",
      color: "text-black",
    },
    {
      title: "Pending Placement Approvals",
      value: "2",
      subtitle: "Awaiting review",
      icon: "📄",
      color: "text-orange-500",
    },
    {
      title: "Pending Evaluations",
      value: "1",
      subtitle: "To be completed",
      icon: "🏅",
      color: "text-blue-500",
    },
  ];

  const supervisedInterns = [
    {
      name: "Sarah Johnson",
      company: "TechCorp Solutions Inc.",
      course: "Software Engineering",
      week: "Week 8/12",
    },
    {
      name: "Robert Kim",
      company: "DataTech Analytics",
      course: "Computer Science",
      week: "Week 10/12",
    },
    {
      name: "Lisa Wang",
      company: "CloudNet Systems",
      course: "Information Technology",
      week: "Week 6/12",
    },
  ];

  const approvals = [
    {
      name: "David Chen - FinTech Corp",
      role: "Software Development Position",
      date: "Submitted on Feb 23, 2026",
    },
    {
      name: "Maria Garcia - InnovateTech",
      role: "UI/UX Design Position",
      date: "Submitted on Feb 22, 2026",
    },
  ];

  const activities = [
    {
      title: "Completed Mid-Term Evaluation for Sarah Johnson",
      subtitle: "Score: 85% - Excellent performance",
      time: "3 days ago",
    },
    {
      title: "Approved Placement for Robert Kim",
      subtitle: "DataTech Analytics - Data Science Position",
      time: "5 days ago",
    },
    {
      title: "Approved Placement for Lisa Wang",
      subtitle: "CloudNet Systems - Cloud Engineering Position",
      time: "1 week ago",
    },
  ];

  return (
    <div className="min-h-screen w-full px-6 py-6 bg-[#f7f5f2]">
      <nav className="mb-8 flex items-center justify-between border-b pb-4">
        <div className="text-2xl">☰</div>
        <div className="flex items-center gap-4">
          <span>🔔</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 font-bold text-[#8d1726]">
            ER
          </div>
          <span>⌄</span>
        </div>
      </nav>

      <h1 className="text-4xl font-bold mb-3">Dashboard</h1>
      <p className="mb-6 text-gray-600 text-xl">
        Welcome back, Dr. Roberts! Here's your supervision overview.
      </p>

      <div className="flex flex-col gap-4 mt-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="w-full p-6 bg-white rounded-2xl shadow-sm border"
          >
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-gray-500 text-xl">{card.title}</h3>
                <div className={`text-5xl font-bold mt-8 ${card.color}`}>
                  {card.value}
                </div>
                <p className="text-gray-600 mt-2 text-lg">{card.subtitle}</p>
              </div>
              <div className="text-3xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <section className="w-full p-6 bg-white rounded-2xl shadow-sm border mt-6">
        <h3 className="text-2xl font-bold mb-2">Supervised Interns</h3>
        <p className="text-gray-500 mb-4">
          Overview of students under your supervision
        </p>

        <div className="flex flex-col gap-4">
          {supervisedInterns.map((intern) => (
            <div key={intern.name} className="p-5 border rounded-2xl bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-semibold">{intern.name}</h4>
                  <p className="text-gray-600">{intern.company}</p>
                  <p className="text-gray-600">{intern.course}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">{intern.week}</p>
                  <div className="w-40 h-3 bg-pink-100 rounded-full mt-3">
                    <div className="w-24 h-3 bg-[#8d1726] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full p-6 bg-white rounded-2xl shadow-sm border mt-6">
        <h3 className="text-2xl font-bold mb-2">Pending Placement Approvals</h3>
        <p className="text-gray-500 mb-4">
          Internship placements awaiting your approval
        </p>

        <div className="flex flex-col gap-4">
          {approvals.map((approval) => (
            <div
              key={approval.name}
              className="p-5 border rounded-2xl bg-yellow-50 border-yellow-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-2xl font-semibold">{approval.name}</h4>
                  <p className="text-gray-600">{approval.role}</p>
                  <p className="text-gray-500 mt-2">{approval.date}</p>
                </div>
                <div className="text-2xl text-orange-500">🕒</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full p-6 bg-white rounded-2xl shadow-sm border mt-6">
        <h3 className="text-2xl font-bold mb-2">Recent Activity</h3>
        <p className="text-gray-500 mb-4">Your latest actions and updates</p>

        <div className="flex flex-col gap-4">
          {activities.map((activity) => (
            <div key={activity.title} className="flex gap-4 border-b pb-4">
              <div className="mt-2 h-3 w-3 rounded-full bg-green-500"></div>
              <div>
                <h4 className="text-2xl font-medium">{activity.title}</h4>
                <p className="text-gray-600">{activity.subtitle}</p>
                <p className="text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;