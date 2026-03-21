import InternComponent from "./InternsSection/InternComponent";

const internsData = [
  {
    url: "https://api.dicebear.com/9.x/notionists/svg",
    names: "Sarah Johnson",
    course: "Computer Science",
    institution: "University of Technology",
    week: 8
  },
  {
    url: "https://api.dicebear.com/9.x/micah/svg?",
    names: "James Martinez",
    course: "Software Engineering",
    institution: "Institute of Technology",
    week: 6
  },

  {
    url: "https://api.dicebear.com/9.x/micah/svg?seed=Aneka",
    names: "Emily Chen",
    course: "Information Systems",
    institution: "State University",
    week: 10
  },

  // {
  //   url: "https://api.dicebear.com/9.x/micah/svg?seed=Liam",
  //   names: "Marcus Holloway",
  //   course: "Computer Science",
  //   institution: "Tech Institute of Technology"
  // },
  // {
  //   url: "https://api.dicebear.com/9.x/micah/svg?seed=Zoe",
  //   names: "Sarah Jenkins",
  //   course: "Data Science",
  //   institution: "Northfield Academy"
  // },
  // {
  //   url: "https://api.dicebear.com/9.x/micah/svg?seed=Jasper",
  //   names: "Arjun Mehta",
  //   course: "Cybersecurity",
  //   institution: "Global Open University"
  // },
  // {
  //   url: "https://api.dicebear.com/9.x/micah/svg?seed=Heidi",
  //   names: "Elena Rodriguez",
  //   course: "Software Engineering",
  //   institution: "Pacific Coast College"
  // },
  // {
  //   url: "https://api.dicebear.com/9.x/micah/svg?seed=Felix",
  //   names: "Jordan Smith",
  //   course: "Business Analytics",
  //   institution: "Metro State University"
  // }
];
const AssignedInternSection = () => {
  return (
    <div className="mt-3 rounded-lg p-6 border col-span-12 bg-white border-stone-300 shadow-inner h-auto">
      <h1 className="font-bold"> Assigned Interns</h1>
      <h2 className="text-gray-500 font-medium">
        OverView of interns under your supervision
      </h2>
      {internsData.map((intern, index) => (
        <InternComponent
          key={index}
          url={intern.url}
          names={intern.names}
          course={intern.course}
          institution={intern.institution}
          week={intern.week}
        />
      ))}
    </div>
  );
};

export default AssignedInternSection;
