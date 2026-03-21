import ActivityTable from "./RecentActivity/ActivityTable";

const activityData = [
  {
    title: "Approved Sarah Johnson's log for week 8",
    comment: "Excellent progress on the Research and Analysis phase.",
    daysPast: 2,
    Approved: true,
  },
  {
    title: "Requested changes on James Martinez's log for week 6",
    comment: "Please provide more details on the implementation challenges.",
    daysPast: 5,
    Approved: false,
  },
  {
    title: "Approved Emily Chen's log for week 10 log",
    comment: "Great work on the final presentation and project completion.",
    daysPast: 3,
    Approved: true,
  },
];

const RecentActivity = () => {
  return (
    <div className="mt-3 rounded-lg p-6 border col-span-12 bg-white border-stone-300 shadow-inner h-auto">
      <h1 className="font-bold"> Recent Activity</h1>
      <h2 className="text-gray-500 font-medium">Your latest review actions</h2>
      <table className="w-full mt-4">
        <tbody className="mt-4 divide-y divide-gray-200">
          {activityData.map((activity, index) => (
            <ActivityTable
              key={index}
              title={activity.title}
              comment={activity.comment}
              daysPast={activity.daysPast}
              Approved={activity.Approved}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivity;
