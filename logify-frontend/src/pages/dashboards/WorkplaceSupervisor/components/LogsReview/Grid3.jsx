import LogAnalytics from "./LogAnalytics"
import PendingLogSection from "./PendingLogSection"


const Grid3 = () => {
  return (
    <div className="px-4 grid gap-3 grid-cols-12 py-8">
      <LogAnalytics />
      <PendingLogSection />
    </div>
  )
}

export default Grid3
