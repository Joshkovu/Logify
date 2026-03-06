const Placements = () => {
  return (
    <div className=" min-h-screen w-full p-4">
      <h1>Placement Management</h1>
      <p>Oversee all internship placements and their statuses</p>
      <section className="flex mt-4 gap-4">
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h1>Total Placements</h1>
          <span>200</span>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h1>Ongoing Placements</h1>
          <span>15</span>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h1>Completed Placements</h1>
          <span>185</span>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h1>Average Duration</h1>
          <span>3 months</span>
        </div>
      </section>
      <section className="mt-4">
        <h1>Recent Placements</h1>
        <p>Latest internship placements and their details</p>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <h1>Student</h1>
            {/* Placeholder for student names */}
          </div>
          <div>
            <h1>Organization</h1>
            {/* Placeholder for organization names */}
          </div>
          <div>
            <h1>Position</h1>
            {/* Placeholder for Position */}
          </div>
          <div>
            <h1>Status</h1>
            {/* Placeholder for status */}
          </div>
          <div>
            <h1>Actions</h1>
            {/* Placeholder for placement actions */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Placements;
