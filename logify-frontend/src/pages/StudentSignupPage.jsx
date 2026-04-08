import AuthLayout from "./auth/AuthLayout";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";

const StudentSignupPage = () => {
  return (
    <GuestOnlyRoute>
      <AuthLayout
        title="Student Signup"
        subtitle="Create a student account for internship logging."
      >
        <form></form>
      </AuthLayout>
    </GuestOnlyRoute>
  );
};

export default StudentSignupPage;
