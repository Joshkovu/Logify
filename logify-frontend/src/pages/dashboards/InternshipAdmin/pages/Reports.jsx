const Reports = () => {
  return (
    <div className="p-4 min-h-screen w-full">
      <section className="flex ">
        <div className="w-1/2">
          <h1>System Reports</h1>
          <p>Comprehensive analytics and reporting</p>
        </div>
        <div className="w-1/2 flex justify-end">
          <button className="flex">
            {/* Placeholder for an icon */}
            Generate Report
          </button>
        </div>
      </section>
      <section className=" mt-4 gap-4">
        <h1>Monthly Performance Trend</h1>
        <p>Student enrollment and average scores by month</p>
      </section>
    </div>
  );
};

export default Reports;
