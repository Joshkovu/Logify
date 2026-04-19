import Grid2 from "../components/AssignedInterns/Grid2";

const AssignedInterns = () => {
  return (
    <div className="bg-[#FCFBF8]  pb-4 shadow h-screen w-full p-16 transition-all overflow-y-auto dark:bg-slate-950">
      <h1 className=" font-bold text-2xl ">Assigned Interns</h1>
      <h2 className="font-light text-lg text-gray-600 dark:text-slate-400">
        Manage and monitor your assigned interns
      </h2>

      <Grid2 />
    </div>
  );
};

export default AssignedInterns;
