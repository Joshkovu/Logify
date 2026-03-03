const Dashboard = () => {
  return (
    <div className="min-h-screen w-full ml-5">
      <nav></nav>
      <h1 className="text-2xl font-bold mb-4">System Dashboard</h1>
      <p>Complete overview of the internship management system</p>
      <div className="flex mrt-4 mt-4 gap-4">
        <div className="w-1/7 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex">
            <div className="w-1/2">
              <h3>Total Interns</h3>
              <span>427</span>
              <span>All the time</span>
            </div>
            <div className="w-1/2">{/* Placeholder for an icon */}</div>
          </div>
        </div>
        <div className="w-1/7 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex">
            <div className="w-1/2">
              <h3>Active Interns</h3>
              <span>120</span>
              <span>Currently active</span>
            </div>
            <div className="w-1/2">{/* Placeholder for an icon */}</div>
          </div>
        </div>
        <div className="w-1/7 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex">
            <div className="w-1/2">
              <h3>Completed Internships</h3>
              <span>300</span>
              <span>All the time</span>
            </div>
            <div className="w-1/2">{/* Placeholder for an icon */}</div>
          </div>
        </div>

        <div className="w-1/7 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex">
            <div className="w-1/2">
              <h3>Average Final score</h3>
              <span>84%</span>
              <span>This semester</span>
            </div>
            <div className="w-1/2">{/* Placeholder for an icon */}</div>
          </div>
        </div>
        <div className="w-1/7 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex">
            <div className="w-1/2">
              <h3>Ongoing Placements</h3>
              <span>15</span>
              <span>Currently active</span>
            </div>
            <div className="w-1/2">{/* Placeholder for an icon */}</div>
          </div>
        </div>
        <div className="w-1/7 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex">
            <div className="w-1/2">
              <h3>Pending Evaluations</h3>
              <span>23</span>
              <span>Currently pending</span>
            </div>
            <div className="w-1/2">{/* Placeholder for an icon */}</div>
          </div>
        </div>
        <div className="w-1/7 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex">
            <div className="w-1/2">
              <h3>New Applications</h3>
              <span>45</span>
              <span>This week</span>
            </div>
            <div className="w-1/2">{/* Placeholder for an icon */}</div>
          </div>
        </div>
        <div className="w-1/7 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex">
            <div className="w-1/2">
              <h3>Total supervisors</h3>
              <span>142</span>
              <span>Academic + Workplace</span>
            </div>
            <div className="w-1/2">{/* Placeholder for an icon */}</div>
          </div>
        </div>
      </div>
      <section className="flex gap-4 mt-4">
        <div className="w-1/2 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">Score Distribution</h3>
          <p> Final evaluation scores breakdown</p>
        </div>
        <div className="w-1/2 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">
            Internship Completion Trend{" "}
          </h3>
          <p>Monthly completion statistics</p>
        </div>
      </section>
      <section>
        <div className="w-full p-4 bg-gray-100 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-bold mb-2">Internship Status Overview</h3>
          <p>Current status of all internships</p>
        </div>
      </section>
      <section>
        <div className="w-full p-4 bg-gray-100 rounded-lg shadow-md mt-4">
          <h1 className="text-lg font-bold">Recent System Activity</h1>
          <p>Latest updates and changes in the system</p>

          <div className="flex">
            <div className="w-1/2">
              {/* Placeholder for activity feed  pointer*/}
            </div>
            <div className="w-1/2">
              <h2>New student registered</h2>
              <p>John Doe registered on 2024-01-15</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
