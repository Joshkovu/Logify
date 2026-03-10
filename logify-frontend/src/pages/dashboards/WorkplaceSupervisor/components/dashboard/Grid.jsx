import InternAnalytics from "./InternAnalytics";
import InternAnalytics from './InternAnalytics'
import AssignedInternSection from './AssignedInternSection'

const Grid = () => {
  return (
    <div className="px-4 grid gap-3 grid-cols-12 py-8">
      <InternAnalytics />
      <AssignedInternSection />
    </div>
  );
};

export default Grid;
