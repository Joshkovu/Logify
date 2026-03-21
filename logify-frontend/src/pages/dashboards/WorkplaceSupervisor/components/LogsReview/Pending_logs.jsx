
const Pending_logs = ({ interns, selectedLog, onSelectLog }) => {
  return (
    <div className="mt-3 rounded-lg p-6 border col-span-4 bg-white border-stone-300 shadow-inner h-auto ">
      <h1 className="font-bold"> Pending Logs</h1>
      <h2 className="text-gray-500 font-medium">Select a log to review</h2>

      <div className="w-full">
        <ul>
          {interns.map((intern, index) => (
            <li
              key={index}
              className={`cursor-pointer  w-full p-3 border hover:shadow-md transition-shadow duration-200 my-3 rounded-lg flex justify-between ${selectedLog === intern ? "border-maroonCustom bg-red-50 " : "border-gray-300"}`}
              onClick={() => onSelectLog(intern)}
            >
              <div>
                <p className="font-bold">{intern.names}</p>
                <p className="text-gray-500 text-sm">Week {intern.week}</p>
                <p className="text-gray-500 text-xs">{intern.date}</p>
              </div>
              <img
                src={intern.url}
                alt={intern.names}
                className="size-15 rounded-full shrink-0 bg-maroonCustom shadow"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};



export default Pending_logs;
