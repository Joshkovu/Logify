const Dashboard = () => {
  const person = {
    firstName: "Sarah",
    lastName: "Johnson",
  };

  return (
    <div className=" min-h-screen m-15">
      <nav></nav>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>
        Welcome back, {person.firstName}! Here&apos;s your internship overview.
      </p>
      <section className="flex mt-4 gap-6">
        <div className="text-gray-600 w-100 p-6 border border-gray-200 rounded-xl mt-4">
          <div className="flex">
            <div className="text-sm">
              <h3 className="text-lg">Internship Status</h3>
              <div className="flex mt-8 mb-5">
                <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
                  ACTIVE
                </span>
                <p className="ml-auto">{/*Placeholder for an icon*/}</p>
              </div>
              <p>Your internship is currently in progress</p>
            </div>
          </div>
        </div>
        <div className="text-gray-600 w-100 p-6 border border-gray-200 rounded-xl mt-4">
          <div className="flex">
            <div className="text-sm">
              <h3 className="text-lg">Weekly Logs</h3>
              <div className="flex mt-8 mb-5">
                <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
                  ACTIVE
                </span>
                <p className="ml-auto">{/*Placeholder for an icon*/}</p>
              </div>
              <p>Your internship is currently in progress</p>
            </div>
          </div>
        </div>
        <div className="text-gray-600 w-100 p-6 border border-gray-200 rounded-xl mt-4">
          <div className="flex">
            <div className="text-sm">
              <h3 className="text-lg">Pending Tasks</h3>
              <div className="flex mt-8 mb-5">
                <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
                  ACTIVE
                </span>
                <p className="ml-auto">{/*Placeholder for an icon*/}</p>
              </div>
              <p>Your internship is currently in progress</p>
            </div>
          </div>
        </div>
        <div className="text-gray-600 w-100 p-6 border border-gray-200 rounded-xl mt-4">
          <div className="flex">
            <div className="text-sm">
              <h3 className="text-lg">Final Score</h3>
              <div className="flex mt-8 mb-5">
                <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
                  ACTIVE
                </span>
                <p className="ml-auto">{/*Placeholder for an icon*/}</p>
              </div>
              <p>Your internship is currently in progress</p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex mt-4">
        <div className="p-6 border border-gray-200 rounded-xl w-full">
          <div className="mb-6">
            <p className="font-semibold">Current Internship</p>
            <p className="text-gray-600">Your active placement details</p>
          </div>
          <div className="flex gap-10">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Organization</p>
              <p className="mb-4 font-semibold">TechCorp Solutions Inc.</p>
              <p className="text-gray-600 text-sm">Workplace Supervisor</p>
              <p className="mb-4 font-semibold">Michael Chen</p>
              <p className="text-gray-600 text-sm">Start Date</p>
              <p className="mb-4 font-semibold">January 15, 2026</p>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Position</p>
              <p className="mb-4 font-semibold">Software Engineering Intern</p>
              <p className="text-gray-600 text-sm">Academic Supervisor</p>
              <p className="mb-4 font-semibold">Dr. Emily Roberts</p>
              <p className="text-gray-600 text-sm">End Date</p>
              <p className="mb-4 font-semibold">April 10, 2026</p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex mt-4">
        <div className="p-6 border border-gray-200 rounded-xl w-full">
          <div className="mb-6">
            <p className="font-semibold">Recent Activity</p>
            <p className="text-gray-600">Your latest updates and actions</p>
          </div>
          <div className="text-sm">
            <div>
              <p className="font-semibold">Week 8 Log Approved</p>
              <p className="text-gray-600">
                Your weekly log has been reviewed and approved by Michael Chen
              </p>
              <p className="text-gray-600 text-xs mt-1.5">2 days ago</p>
              <hr className="mt-5 mb-4 border-gray-100" />
            </div>
            <div>
              <p className="font-semibold">Week 8 Log Submitted</p>
              <p className="text-gray-600">
                Successfully submitted your weekly log for review
              </p>
              <p className="text-gray-600 text-xs mt-1.5">4 days ago</p>
              <hr className="mt-5 mb-4 border-gray-100" />
            </div>
            <div>
              <p className="font-semibold">Week 7 Log Approved</p>
              <p className="text-gray-600">
                Your weekly log has been reviewed and approved
              </p>
              <p className="text-gray-600 text-xs mt-1.5">1 week ago</p>
              <hr className="mt-5 mb-4 border-gray-100" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
