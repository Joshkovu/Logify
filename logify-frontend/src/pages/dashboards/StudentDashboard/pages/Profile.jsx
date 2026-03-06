const Profile = () => {
  return (
    <div className="min-h-screen m-15">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Manage your personal information and settings</p>
      </div>
      <section>
        <div className="mb-4 flex w-full rounded-xl p-6 bg-white border border-gray-200">
          <div className="h-25 w-25 bg-blue-600 rounded-l-full rounded-r-full p-6 text-2xl text-white">
            {/*Placeholder for a profile picture*/}
          </div>
          <div className="ml-4">
            <p className="font-bold text-2xl">Sarah Johnson</p>
            <p className="text-gray-600">Software Engineering Student</p>
            <p className="text-sm text-gray-600"> Student ID: 123467890</p>
            <div className="mt-4 flex gap-2">
              <button className="text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200 rounded-md p-1">
                Edit Profile
              </button>
              <button className="text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200 rounded-md p-1">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="flex mt-4">
        <div className="bg-white p-6 border border-gray-200 rounded-xl w-full">
          <div className="mb-4">
            <p className="font-semibold">Personal Information</p>
            <p className="text-gray-600">
              Your basic information and contact details
            </p>
          </div>
          <div className="flex gap-10">
            <div className="flex-1">
              <p className="mt-4 font-semibold">First Name</p>
              <p className="text-gray-600 text-sm">Sarah</p>
              <p className="mt-4 font-semibold">Email Adress</p>
              <p className="text-gray-600 text-sm">
                sarah.johnson@university.edu
              </p>
              <p className="mt-4 font-semibold">Date of Birth</p>
              <p className="text-gray-600 text-sm">March 15, 2002</p>
            </div>
            <div className="flex-1">
              <p className="mt-4 font-semibold">Last Name</p>
              <p className="text-gray-600 text-sm">Johnson</p>
              <p className="mt-4 font-semibold">Phone Number</p>
              <p className="text-gray-600 text-sm">+1 (555) 234-5678</p>
              <p className="mt-4 font-semibold">Address</p>
              <p className="text-gray-600 text-sm">
                123 Student Lane, Campus City
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex mt-4">
        <div className="bg-white p-6 border border-gray-200 rounded-xl w-full">
          <div className="mb-4">
            <p className="font-semibold">Academic Information</p>
            <p className="text-gray-600">Your university and program details</p>
          </div>
          <div className="flex gap-10">
            <div className="flex-1">
              <p className="mt-4 font-semibold">University</p>
              <p className="text-gray-600 text-sm">University of Technology</p>
              <p className="mt-4 font-semibold">Program</p>
              <p className="text-gray-600 text-sm">
                Bachelor of Science in Software Engineering
              </p>
              <p className="mt-4 font-semibold">Expected Graduation</p>
              <p className="text-gray-600 text-sm">June 2026</p>
            </div>
            <div className="flex-1">
              <p className="mt-4 font-semibold">Student Number</p>
              <p className="text-gray-600 text-sm">1234567890</p>
              <p className="mt-4 font-semibold">Year Level</p>
              <p className="text-gray-600 text-sm">4th Year</p>
              <p className="mt-4 font-semibold">Current GPA</p>
              <p className="text-gray-600 text-sm">3.85 / 4.00</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-4">
        <div className="flex-col gap-4 bg-white flex flex-col-auto border-gray-200 border p-6 rounded-xl w-full">
          <p className="font-semibold -mb-4">Account Settings</p>
          <p className="text-gray-600">Manage your account preferences</p>
          <div className="flex w-full text-gray-600 text-sm border-gray-200 border rounded-xl p-6">
            <div>
              <p className="font-semibold text-lg text-black">
                Email Notifications
              </p>
              <p className="">Receive updates about your internship</p>
            </div>
            <div className="ml-auto mt-2">
              <button className="text-black text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200 rounded-md p-1">
                Enabled
              </button>
            </div>
          </div>
          <div className="flex w-full text-gray-600 text-sm border-gray-200 border rounded-xl p-6">
            <div>
              <p className="font-semibold text-lg text-black">
                Two-Factor Authentication
              </p>
              <p className="">Add an extra layer of security</p>
            </div>
            <div className="ml-auto mt-2">
              <button className="text-black text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200 rounded-md p-1">
                Enable
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
