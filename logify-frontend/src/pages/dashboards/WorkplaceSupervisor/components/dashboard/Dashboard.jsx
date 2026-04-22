import { userDataViewModel } from "../../viewmodels/UserDataViewModel";
import CircularLoadingIndicator from "./CircularLoadingIndicator";
import Grid from "./Grid";

const Dashboard = () => {
  const { userData, loading, error } = userDataViewModel();

  // 1. Loading State: Centered full-screen coverage
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FCFBF8] dark:bg-slate-950">
        <CircularLoadingIndicator size="size-12" color="text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  // 2. Error State: Clean, centered feedback
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FCFBF8] dark:bg-slate-950 p-16">
        <div className="text-center">
          <p className="text-red-500 font-medium text-lg">Failed to load dashboard</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-slate-900 dark:bg-slate-100 dark:text-slate-950 text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // 3. Success State: With a native CSS fade-in
  return (
    <div className="bg-[#FCFBF8] pb-4 shadow h-screen w-full p-16 overflow-y-auto dark:bg-slate-950 transition-colors duration-500">
      {/* Standard Tailwind transition: 
         We use an entry animation class 'animate-in' or a custom fade 
      */}
      <div className="animate-in fade-in duration-700 slide-in-from-bottom-2">
        <h1 className="font-bold text-2xl dark:text-white">Dashboard</h1>
        <h2 className="font-light text-lg text-gray-600 dark:text-slate-400">
          Welcome back, {userData.first_name}! Here is your supervision overview
        </h2>

        <div className="mt-8">
          <Grid />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;