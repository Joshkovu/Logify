const Students = () => {
  return (
    <div className="min-h-screen w-full">
      <nav></nav>
      <div className="flex">
        <div className="w-1/2">
          <h1>Student Management</h1>
          <p>Overview of student performance and engagement</p>
        </div>
        <div className="w-1/2">
          <button className="flex">
            {/* Placeholder for an icon */}
            Upload CSV
          </button>
          <button className="bg-blue-500 flex text-white px-4 py-2 rounded">
            {/* Placeholder for an icon */}
            Generate Report
          </button>
        </div>
      </div>
      <section className="flex mt-4 mb-4">
        <div className="border rounded-e-md bg-zinc-300 border-gray-300 p-3 mr-3">
          <h1>Total Students</h1>
          <span>5</span>
        </div>
        <div className="border rounded-e-md bg-zinc-300 border-gray-300 p-3 mr-3">
          <h1>Active Internships</h1>
          <span>3</span>
        </div>
        <div className="border rounded-e-md bg-zinc-300 border-gray-300 p-3 mr-3">
          <h1>Pending Placements</h1>
          <span>2</span>
        </div>
        <div className="border rounded-e-md bg-zinc-300 border-gray-300 p-3 mr-3">
          <h1>Average Score</h1>
          <span>84.2%</span>
        </div>
      </section>
      <section>
        <div className="flex mb-5">
          <div className="w-1/2">
            <h1>All Students</h1>
            <p>Complete student registry</p>
          </div>
          <div className="flex">
            {/* Placeholder for a search icon */}
            <input
              type="text"
              placeholder="Search students..."
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-6">
          <div className="border border-gray-300 p-2">
            <h1>Student ID</h1>
          </div>
          <div className="border border-gray-300 p-2">
            <h1>Name</h1>
          </div>
          <div className="border border-gray-300 p-2">
            <h1>Program</h1>
          </div>
          <div className="border border-gray-300 p-2">
            <h1>Status</h1>
          </div>
          <div className="border border-gray-300 p-2">
            <h1>Score</h1>
          </div>
          <div className="border border-gray-300 p-2">
            <h1>Action</h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Students;
