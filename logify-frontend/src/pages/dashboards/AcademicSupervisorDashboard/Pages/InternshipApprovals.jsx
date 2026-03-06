const InternshipApprovals = () => {
  const stats = [
    {
      title: "Pending Approvals",
      value: "2",
      subtitle: "Awaiting review",
      color: "text-orange-500",
    },
    {
      title: "This Month",
      value: "8",
      subtitle: "Placements approved",
      color: "text-green-500",
    },
    {
      title: "Approval Rate",
      value: "95%",
      subtitle: "This semester",
      color: "text-blue-500",
    },
  ];

  const approvals = [
    {
      name: "David Chen",
      regNo: "2024001456",
      program: "Computer Science",
      submittedOn: "Feb 23, 2026",
      organization: "FinTech Corp",
      address: "789 Finance Ave, Financial District, NY 10004",
      position: "Software Development Intern",
      duration: "March 1, 2026 - May 24, 2026",
      supervisor: "Jennifer Lee",
      email: "j.lee@fintechcorp.com",
      phone: "+1 (555) 789-0123",
      status: "Pending",
    },
    {
      name: "Maria Garcia",
      regNo: "2024001567",
      program: "Information Technology",
      submittedOn: "Feb 22, 2026",
      organization: "InnovateTech",
      address: "321 Design Street, Creative Quarter, SF 94103",
      position: "UI/UX Design Intern",
      duration: "March 8, 2026 - May 31, 2026",
      supervisor: "Thomas Anderson",
      email: "t.anderson@innovatetech.com",
      phone: "+1 (555) 890-1234",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f7f5f2] px-6 py-6">
      <h1 className="mb-3 text-4xl font-bold">Internship Approvals</h1>
      <p className="mb-8 max-w-xl text-xl text-gray-600">
        Review and approve student internship placements
      </p>

      <div className="flex flex-col gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h3 className="text-2xl text-gray-500">{stat.title}</h3>
            <div className={`mt-10 text-5xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="mt-2 text-lg text-gray-600">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {approvals.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold">{item.name}</h2>
                <p className="text-2xl text-gray-500">
                  {item.regNo} • {item.program}
                </p>
              </div>

              <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-orange-600">
                {item.status}
              </span>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-3xl font-semibold">
                Student Information
              </h3>

              <p className="text-2xl text-gray-500">Student Name</p>
              <p className="mb-5 text-3xl">{item.name}</p>

              <p className="text-2xl text-gray-500">Program</p>
              <p className="mb-5 text-3xl">{item.program}</p>

              <p className="text-2xl text-gray-500">Submitted On</p>
              <p className="mb-8 text-3xl">{item.submittedOn}</p>
            </div>

            <div>
              <h3 className="mb-4 text-3xl font-semibold">
                Organization Details
              </h3>

              <p className="text-2xl text-gray-500">Organization</p>
              <p className="mb-5 text-3xl">{item.organization}</p>

              <p className="text-2xl text-gray-500">Address</p>
              <p className="mb-8 text-3xl">{item.address}</p>
            </div>

            <div>
              <h3 className="mb-4 text-3xl font-semibold">Position Details</h3>

              <p className="text-2xl text-gray-500">Position Title</p>
              <p className="mb-5 text-3xl">{item.position}</p>

              <p className="text-2xl text-gray-500">Duration</p>
              <p className="mb-8 text-3xl">{item.duration}</p>
            </div>

            <div>
              <h3 className="mb-4 text-3xl font-semibold">
                Workplace Supervisor
              </h3>

              <p className="text-2xl text-gray-500">Name</p>
              <p className="mb-5 text-3xl">{item.supervisor}</p>

              <p className="text-2xl text-gray-500">Email</p>
              <p className="mb-5 text-3xl">{item.email}</p>

              <p className="text-2xl text-gray-500">Phone</p>
              <p className="mb-8 text-3xl">{item.phone}</p>
            </div>

            <div className="border-t pt-6">
              <div className="flex gap-4">
                <button className="rounded-xl bg-green-500 px-6 py-3 text-xl font-medium text-white">
                  Approve Placement
                </button>

                <button className="rounded-xl border border-red-500 px-6 py-3 text-xl font-medium text-red-500">
                  Reject Placement
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternshipApprovals;