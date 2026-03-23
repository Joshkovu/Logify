import LogComponent from "./PendingLogs/LogComponent";

const internsData = [
  {
    url: "https://api.dicebear.com/9.x/notionists/svg",
    names: "Sarah Johnson",
    date: "February 25, 2026",
    week: 8,
  },
  {
    url: "https://api.dicebear.com/9.x/micah/svg?",
    names: "James Martinez",
    date: "February 20, 2026",
    week: 6,
  },
];

const PendingLogs = () => {
  return (
    <div className="mt-3 rounded-lg p-6 border col-span-12 bg-white border-stone-300 shadow-inner h-auto">
      <h1 className="font-bold"> Pending Log Review</h1>
      <h2 className="text-gray-500 font-medium">
        Logs that need your review and approval
      </h2>
      {internsData.map((intern, index) => (
        <LogComponent
          key={index}
          url={intern.url}
          names={intern.names}
          week={intern.week}
          date={intern.date}
        />
      ))}
    </div>
  );
};

export default PendingLogs;
