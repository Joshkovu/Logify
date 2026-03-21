
import CommentSection from "./CommentSection";
import LogReview from "./LogReview";
import Pending_logs from "./Pending_logs";
import { useState } from "react";

export const interns = [
  {
    names: "Sarah Johnson",
    week: 9,
    date: "February 25, 2026",
    url: "https://api.dicebear.com/9.x/notionists/svg",
    log: {
        activities: "This week I focused on refactoring the authentication module using React Context API. I implemented token-based authentication with JWT and integrated it with the backend API. Additionally, I worked on creating protected routes and implementing role-based access control. I also participated in daily stand-up meetings and code reviews with the team.",
        learnings: "I learned about secure authentication practices, including password hashing, token management, and session handling. I gained deeper understanding of React Context API and how to structure authentication flows in a production environment. The code review sessions taught me best practices for writing clean, maintainable code.",
        challenges: "Faced challenges with slow query performance due to large datasets, but resolved it by implementing proper indexing and optimizing the query logic. Also had to troubleshoot some issues with data consistency, which I addressed by implementing transactions and improving error handling in the database layer."
    }
  },
  {
    names: "James Martinez",
    week: 7,
    date: "February 24, 2026",
    url: "https://api.dicebear.com/9.x/micah/svg?",
    log:{
        activities: "This week I worked on optimizing the database queries for the user dashboard. I implemented indexing and optimized the query structure to reduce load times. I also collaborated with the frontend team to ensure that the API responses were efficient and met their requirements. Additionally, I attended a workshop on advanced SQL techniques.",
        learnings: "I learned about database optimization strategies, including indexing and query restructuring. The workshop provided insights into advanced SQL features and performance tuning. I also improved my collaboration skills by working closely with the frontend team to align our efforts.",
        challenges: "Faced challenges with slow query performance due to large datasets, but resolved it by implementing proper indexing and optimizing the query logic. Also had to troubleshoot some issues with data consistency, which I addressed by implementing transactions and improving error handling in the database layer."
    } 
  }
];

const PendingLogSection = () => {
  const [pendingLogs, setPendingLogs] = useState(interns[0]);
  return <div className="grid col-span-12 mt-6 gap-3 grid-cols-12">
    <Pending_logs interns={interns} selectedLog={pendingLogs} onSelectLog={setPendingLogs} />
    <section className="col-span-8">

    <LogReview intern={pendingLogs}/>
    <CommentSection intern_log={pendingLogs} selectedLog={pendingLogs} />
    </section>
  </div>;
};

export default PendingLogSection;
