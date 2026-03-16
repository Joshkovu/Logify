import Intern_details from "./Intern_details";
const intern_card_data = [
  {
    url: "https://api.dicebear.com/9.x/notionists/svg",
    names: "Sarah Johnson",
    course: "Computer Science",
    institution: "University of Technology",
    start_date: "January 15, 2026",
    performance: "Excellent",
    week: 8,
    email: "sarah.johnson@university.edu",
    contact: "+1 (555) 234-5678",
    logs: 8,
  },
  {
    url: "https://api.dicebear.com/9.x/micah/svg?",
    names: "James Martinez",
    course: "Software Engineering",
    institution: "Institute of Technology",
    start_date: "February 1, 2026",
    performance: "Good",
    week: 6,
    email: "james.martinez@university.edu",
    contact: "+1 (555) 987-6543",
    logs: 5,
  },

  {
    url: "https://api.dicebear.com/9.x/micah/svg?seed=Aneka",
    names: "Emily Chen",
    course: "Information Systems",
    institution: "State University",
    start_date: "January 20, 2026",
    performance: "Satisfactory",
    week: 4,
    email: "emily.chen@university.edu",
    contact: "+1 (555) 123-4567",
    logs: 4,
  },
];
const Intern_card = () => {
  return (
    <div className="col-span-12">
      {intern_card_data.map((intern, index) => (
        <Intern_details
          key={index}
          image={intern.url}
          name={intern.names}
          course={intern.course}
          institution={intern.institution}
          start_date={intern.start_date}
          performance={intern.performance}
          week={intern.week}
          email={intern.email}
          contact={intern.contact}
          logs={intern.logs}
        />
      ))}
    </div>
  );
};

export default Intern_card;
