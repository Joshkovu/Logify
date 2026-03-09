import InternComponent from "./InternsSection/InternComponent"

const internsData = [
  {
    url: "https://api.dicebear.com/9.x/notionists/svg",
    names: "Sarah Johnson",
    course: "Computer Science",
    institution: "University of Technology"
  },
  {
    url: "https://api.dicebear.com/9.x/micah/svg?",
    names: "James Martinez",
    course: "Software Engineering",
    institution: "Institute of Technology"
  },

  {
    url: "https://api.dicebear.com/9.x/micah/svg?seed=Aneka",
    names: "Emily Chen",
    course: "Information Systems",
    institution: "State University"
  },
  
];
const AssignedInternSection = () => {
  return (
    <div  className="mt-3 rounded-lg p-6 border col-span-12 bg-white border-stone-300 shadow-inner">
      <h1 className="font-bold"> Assigned Interns</h1>
      <h2 className="text-gray-500 font-medium">OverView of interns under your supervision</h2>
      {internsData.map((intern, index) => (
        <InternComponent
          key={index}
          url={intern.url}
          names={intern.names}
          course={intern.course}Aneka
          institution={intern.institution}
        />
      ))}
    </div>
  )
}

export default AssignedInternSection
