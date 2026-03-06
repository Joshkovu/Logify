const InternshipPlacement = () => {
  return (
    <div className=" min-h-screen m-15">
      <nav></nav>
      <div className="flex">
        <div>
          <h1 className="text-2xl font-bold mb-4">Internship Placement</h1>
          <p>View and manage your internship placement details</p>
        </div>
        <div className="ml-auto mt-2.5">
          <button className="font-semibold text-gray-400 border border-gray-200 rounded-md p-1.5">
            Edit Details
          </button>
        </div>
      </div>
      <section className="bg-white mt-8 p-6 border border-gray-200 rounded-xl w-full">
        <div className="flex ">
          <div>
            <p className="font-semibold">Placement Status</p>
            <p className="text-gray-600">
              Current status of your internship placement
            </p>
          </div>
          <div className="mt-3 ml-auto">
            <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
              ACTIVE
            </span>
          </div>
        </div>
        <div className="mt-10 flex gap-10">
          <div className="flex-1">
            <p className="text-gray-600 text-sm">Start Date</p>
            <p className="mb-4 font-semibold">January 15, 2026</p>
          </div>
          <div className="flex-1">
            <p className="text-gray-600 text-sm">End Date</p>
            <p className="mb-4 font-semibold">April 10, 2026</p>
          </div>
        </div>
      </section>
      <section className="flex mt-4">
        <div className="bg-white p-6 border border-gray-200 rounded-xl w-full">
          <div className="mb-6">
            <p className="font-semibold">Organization Information</p>
            <p className="text-gray-600">
              Details about your host organization
            </p>
          </div>
          <div className="flex-1">
            <p className="text-gray-600 text-sm">Organization Name</p>
            <p className="mb-4 font-semibold">TechCorp Solutions Inc.</p>
            <p className="text-gray-600 text-sm">Address</p>
            <p className="mb-4 font-semibold">
              456 Innovation Drive, Tech Park, Silicon Valley, CA 94025
            </p>
            <p className="text-gray-600 text-sm">Contact Number</p>
            <p className="mb-4 font-semibold">+1 (555) 123-4567</p>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="mb-4 font-semibold">contact@techcorp.com</p>
          </div>
        </div>
      </section>
      <section className="flex mt-4">
        <div className="bg-white p-6 border border-gray-200 rounded-xl w-full">
          <div className="mb-6">
            <p className="font-semibold">Workplace Supervisor</p>
            <p className="text-gray-600">
              Your supervisor at the host organization
            </p>
          </div>
          <div className="flex-1">
            <p className="text-gray-600 text-sm">Name</p>
            <p className="mb-4 font-semibold">Michael Chen</p>
            <p className="text-gray-600 text-sm">Position</p>
            <p className="mb-4 font-semibold">Senior Software Engineer</p>
            <p className="text-gray-600 text-sm">Contact Number</p>
            <p className="mb-4 font-semibold">+1 (555) 123-4568</p>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="mb-4 font-semibold">email.michaelchen@techcorp.com</p>
          </div>
        </div>
      </section>
      <section className="flex mt-4">
        <div className="bg-white p-6 border border-gray-200 rounded-xl w-full">
          <div className="mb-6">
            <p className="font-semibold">Academic Supervisor</p>
            <p className="text-gray-600">Your university supervisor</p>
          </div>
          <div className="flex-1">
            <p className="text-gray-600 text-sm">Name</p>
            <p className="mb-4 font-semibold">Dr. Emily Roberts</p>
            <p className="text-gray-600 text-sm">Department</p>
            <p className="mb-4 font-semibold">Computer Science</p>
            <p className="text-gray-600 text-sm">Contact Number</p>
            <p className="mb-4 font-semibold">+1 (555) 987-6543</p>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="mb-4 font-semibold">contact@techcorp.com</p>
          </div>
        </div>
      </section>
      <section className="flex mt-4">
        <div className="bg-white p-6 border border-gray-200 rounded-xl w-full">
          <div className="mb-6">
            <p className="font-semibold">Status Timeline</p>
            <p className="text-gray-600">
              History of your placement status changes
            </p>
          </div>
          <div className="text-sm">
            <div>
              <p className="font-semibold">Internship Started</p>
              <p className="text-gray-600">
                Your internsip has officially begun
              </p>
              <p className="text-gray-600 text-xs mt-1.5">2 days ago</p>
              <hr className="mt-5 mb-4 border-gray-100" />
            </div>
            <div>
              <p className="font-semibold">Placement Approved</p>
              <p className="text-gray-600">
                Dr. Emily Roberts approved your internship placement
              </p>
              <p className="text-gray-600 text-xs mt-1.5">4 days ago</p>
              <hr className="mt-5 mb-4 border-gray-100" />
            </div>
            <div>
              <p className="font-semibold">Placement Submitted</p>
              <p className="text-gray-600">
                You submitted your placement details for review
              </p>
              <p className="text-gray-600 text-xs mt-1.5">1 week ago</p>
              <hr className="mt-5 mb-4 border-gray-100" />
            </div>
          </div>
        </div>
      </section>{" "}
    </div>
  );
};

export default InternshipPlacement;
