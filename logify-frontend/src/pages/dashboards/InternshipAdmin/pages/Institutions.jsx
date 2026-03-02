const Institutions = () => {
  return (
    <div className="min-h-screen w-full">
      <nav></nav>
      <section className="flex">
        <div className="w-1/2">
          <h1>Partner Institutions</h1>
          <p>Manage organizations offering internship placements</p>
        </div>
        <div className="w-1/2">
          <button className="flex">
            {/* Placeholder for an icon */}
            Add Institution
          </button>
        </div>
      </section>
      <section className="flex">
        <div className=" p-4 mr-3 bg-gray-100 rounded-lg shadow-md">
          <h1>Total Organizations</h1>
          <span>5</span>
        </div>
        <div className=" p-4 mr-3 bg-gray-100 rounded-lg shadow-md">
          <h1>Active Organizations</h1>
          <span>3</span>
        </div>
        <div className=" p-4  bg-gray-100 rounded-lg shadow-md">
          <h1>Total Interns</h1>
          <span>2</span>
        </div>
      </section>
      <main>
        <h2 className="text-xl font-bold mb-4">Organization List</h2>
        <p>Complete list of partner organizations</p>
        <div className="grid grid-cols-3">
          <div className="w-1/3">
            <h1>Organization Name </h1>
            {/* Placeholder for organization details */}
          </div>
          <div className="w-1/3">
            <h1>Industry Type</h1>
            {/* Placeholder for industry type */}
          </div>
          <div className="w-1/3">
            <h1>Contact Email</h1>
            {/* Placeholder for contact email */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Institutions;
