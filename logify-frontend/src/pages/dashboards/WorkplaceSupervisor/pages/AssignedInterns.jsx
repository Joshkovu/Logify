import Grid2 from "../components/AssignedInterns/Grid2";

const AssignedInterns = () => {
  return (
    <div className="bg-[#FCFBF8]  pb-4 shadow h-screen w-screen p-16 transition-all">
      <h1 className=" font-bold text-2xl ">Assigned Interns</h1>
      <h2 className="font-light text-lg text-gray-600">
        Manage and monitor your assigned interns
      </h2>

      <Grid2 />
    </div>
  );
};

export default AssignedInterns;
