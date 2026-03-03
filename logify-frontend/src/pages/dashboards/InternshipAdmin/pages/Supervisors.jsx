const Supervisors = () => {
  return (
    <div className="p-4 min-h-screen w-full">
      <section className="flex">
        <div className="w-1/2">
          <h1>Supervisor Management</h1>
          <p>Manage all supervisors and their assigned interns</p>
        </div>
        <div className="w-1/2 flex justify-end">
          <button className="flex">
            {/* Placeholder for an icon */}
            Add Supervisor
          </button>
        </div>
      </section>
      <section className=" flex mt-4 gap-4">
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h1>Total Supervisors</h1>
          <span>10</span>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h1>Academic Supervisors</h1>
          <span>8</span>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h1>Total Interns Supervised</h1>
          <span>20</span>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h1>Workplace Supervisors</h1>
          <span>18</span>
        </div>
      </section>
      <section className="mt-4">
        <h1>All Supervisors</h1>
        <p>Complete list of all supervisors</p>
        <div className="grid grid-cols-6">
          <div className="border border-gray-300 p-2">
            <h1>Name </h1>
          </div>
          <div className="border border-gray-300 p-2">
            <h1>Type</h1>
          </div>
          <div className="border border-gray-300 p-2">
            <h1>Affiliation</h1>
          </div>
          <div className="border border-gray-300 p-2">
            <h1>Assigned Interns</h1>
          </div>
          <div className="border border-gray-300 p-2">
            <h1>Contact Email</h1>
          </div>
          <div className="border border-gray-300 p-2">
            <h1>Actions</h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Supervisors;
