const Settings = () => {
  return (
    <div className="p-4 min-h-screen w-full">
      <h1>System settings</h1>
      <p>Configure system-wide settings and preferences</p>
      <section className="mt-4 pl-4 border border-gray-200 p-4 rounded-lg">
        <h1>General Settings</h1>
        <p>Manage system-wide preferences and configurations</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h1>System Name</h1>
            {/* Placeholder for system name input */}
          </div>
          <div>
            <h1>Admin Contact</h1>
            {/* Placeholder for admin contact input */}
          </div>
        </div>
      </section>
      <section className="mt-4 pl-4 border border-gray-200 p-4 rounded-lg">
        <div>
          <h1>Notification Settings</h1>
          <p>Configure email and system notifications</p>
          {/* Placeholder for notification settings */}
        </div>
        <div className="flex ">
          <div>
            <h1>Email Notifications</h1>
            <p>Send email notifications for important events </p>
          </div>
          <div>{/* Placeholder for email notification settings */}</div>
        </div>
        <div className="flex ">
          <div>
            <h1>Supervisor Reminders</h1>
            <p>Remind supervisors about pending reviews </p>
          </div>
          <div>{/* Placeholder for supervisor reminder settings */}</div>
        </div>
      </section>
      <section className="mt-4 pl-4 border border-gray-200 p-4 rounded-lg"></section>
      <h1>Evaluation Settings</h1>
      <p>Configure evaluation parameters</p>
      <h2>Minimum passing score</h2>
      <input type="text" placeholder="60" />
      <div className="flex">
        <div>
          <h1>Evaluation Types</h1>
          <p>Define types of evaluations used in the system</p>
        </div>
        <div>{/* Placeholder for evaluation type settings */}</div>
      </div>
    </div>
  );
};

export default Settings;
