const Profile = () => {
  const personalInfo = [
    { label: "First Name", value: "Emily" },
    { label: "Last Name", value: "Roberts" },
    { label: "Email Address", value: "e.roberts@university.edu" },
    { label: "Office Phone", value: "+1 (555) 987-6543" },
  ];

  const academicInfo = [
    { label: "University", value: "University of Technology" },
    { label: "Department", value: "Computer Science" },
    { label: "Position", value: "Associate Professor" },
    { label: "Office Location", value: "Building A, Room 305" },
    {
      label: "Specialization",
      value: "Software Engineering & Artificial Intelligence",
    },
    { label: "Years at University", value: "12 years" },
  ];

  const stats = [
    { value: "5", label: "Current Interns", color: "text-black" },
    { value: "15", label: "Total This Semester", color: "text-blue-600" },
    { value: "86.6%", label: "Average Score", color: "text-green-500" },
    { value: "95%", label: "Completion Rate", color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f7f5f2] px-6 py-6">
      <h1 className="text-4xl font-bold">Profile</h1>
      <p className="mt-3 text-xl text-gray-600">
        Manage your academic supervisor information
      </p>

      <div className="mt-8 rounded-2xl border bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-blue-600 text-5xl text-white">
          ER
        </div>

        <h2 className="mt-8 text-4xl font-bold">Dr. Emily Roberts</h2>
        <p className="mt-2 text-2xl text-gray-600">Academic Supervisor</p>
        <p className="mt-2 text-xl text-gray-500">Computer Science Department</p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="rounded-xl border px-6 py-3 text-xl">
            Edit Profile
          </button>
          <button className="rounded-xl border px-6 py-3 text-xl">
            Change Password
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Personal Information</h2>
        <p className="mt-2 text-xl text-gray-500">
          Your contact and professional details
        </p>

        <div className="mt-8 space-y-6">
          {personalInfo.map((item) => (
            <div key={item.label}>
              <p className="text-xl font-medium">{item.label}</p>
              <p className="mt-3 text-2xl text-gray-500">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Academic Information</h2>
        <p className="mt-2 text-xl text-gray-500">
          Your university and department details
        </p>

        <div className="mt-8 space-y-6">
          {academicInfo.map((item) => (
            <div key={item.label}>
              <p className="text-xl font-medium">{item.label}</p>
              <p className="mt-3 text-2xl text-gray-500">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Supervision Statistics</h2>
        <p className="mt-2 text-xl text-gray-500">
          Your internship supervision overview
        </p>

        <div className="mt-8 space-y-6">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-gray-50 px-6 py-8 text-center"
            >
              <p className={`text-5xl font-bold ${item.color}`}>{item.value}</p>
              <p className="mt-3 text-xl text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;