import InternComponent from "./InternsSection/InternComponent";
import { assignedInternsViewModel } from "../../viewmodels/AssignedInternsViewModel";

const SkeletonLoader = () => (
  <div className="w-full p-4 border bg-white border-stone-300 items-center rounded-lg flex mt-3 flex-row shadow dark:bg-slate-800/50 dark:border-slate-700 animate-pulse transition-all duration-500">
    <div className="flex flex-1">
      <div className="size-20 rounded-full shrink-0 bg-slate-200 dark:bg-slate-700 shadow" />
      <div className="mx-3 mt-3 space-y-3">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-md" />
        <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800 rounded-md" />
        <div className="h-3 w-40 bg-slate-100 dark:bg-slate-800 rounded-md" />
      </div>
    </div>
    <div className="flex flex-col items-end space-y-3">
      <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded-md" />
      <div className="h-2 w-24 rounded-full bg-slate-100 dark:bg-slate-800" />
    </div>
  </div>
);

const AssignedInternSection = () => {
  const { assignedInterns, loading, error } = assignedInternsViewModel();

  return (
    <div className="mt-3 rounded-lg p-6 border col-span-12 bg-white border-stone-300 shadow-inner h-auto dark:bg-slate-800/50 dark:border-slate-700 transition-colors duration-300">
      <h1 className="font-bold"> Assigned Interns</h1>
      <h2 className="text-gray-500 font-medium dark:text-slate-400">
        Overview of interns under your supervision
      </h2>

      <div className="mt-2">
        {loading ? (
          /* Render 3 skeleton items to fill the space */
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 mt-4 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
             <p className="text-red-500 font-medium">
              Failed to load assigned interns: {error.message}
            </p>
          </div>
        ) : (
          /* Smooth fade-in wrapper for the loaded content */
          <div className="animate-in fade-in duration-700 slide-in-from-bottom-2">
            {assignedInterns.interns.map((intern, index) => (
              <InternComponent
                key={index}
                url={intern.avatarUrl || "https://api.dicebear.com/9.x/notionists/svg"}
                names={intern.intern_name}
                course={intern.course}
                institution={intern.institution}
                week={intern.week}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedInternSection;
