import InternAnalytics from './InternAnalytics'
import AssignedInternSection from './AssignedInternSection'
import PendingLogs from './PendingLogs'
import RecentActivity from './RecentActivity'

const Grid = () => {
  return (
    <div className="px-4 grid gap-3 grid-cols-12 py-8">
      <InternAnalytics />
      <AssignedInternSection />
      <PendingLogs />
      <RecentActivity />
    </div>
  );
};

export default Grid;
