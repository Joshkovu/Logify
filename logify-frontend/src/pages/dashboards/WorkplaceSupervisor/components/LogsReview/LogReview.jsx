
const LogReview = ({intern}) => {
  return (
    <div className="mt-3 rounded-lg p-6 border  bg-white border-stone-300 shadow-inner h-auto ">

        <div className="flex items-center justify-between mb-4 border-b pb-3 border-stone-300">
            <div>

            <h1 className="font-bold">{intern.names} - Week {intern.week}</h1>
            <p className="text-gray-500 text-sm">Submitted on {intern.date}</p>
            </div>
            <div className="p-1 border border-amber-400 rounded-lg bg-amber-50">
                <p className="text-xs font-bold text-amber-600">Pending Review</p>
            </div>
        </div>

        <div className="">
            <h2 className="font-bold text-2xl mb-2">Activities & Tasks Completed</h2>
            <p className="text-gray-700 mb-4 text-xl">{intern.log.activities}</p>

            <h2 className="font-bold text-2xl mb-2">Key Learnings</h2>
            <p className="text-gray-700 mb-4 text-xl">{intern.log.learnings}</p>

            <h2 className="font-bold text-2xl mb-2">Challenges & Solutions</h2>
            <p className="text-gray-700 mb-4 text-xl">{intern.log.challenges}</p>
        </div>

        
    </div>
  )
};



export default LogReview
