import AssignedInternAnalytics from "../dashboard/InternsSection/AssignedInternAnalytics";
import Intern_card from "./Intern_card";



const Grid2 = () => {
  return (
    <div className="px-4 grid gap-3 grid-cols-12 py-8">
      <AssignedInternAnalytics />
      <Intern_card />
    </div>
  );
};

export default Grid2;
