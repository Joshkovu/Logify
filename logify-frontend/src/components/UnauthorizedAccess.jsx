import { useNavigate } from "react-router-dom";

const UnauthorizedAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-6">
      <h1 className="text-6xl font-black text-maroon-dark mb-4">403</h1>
      <h3 className="text-2xl font-semibold mb-4">Forbidden</h3>
      <p className="max-w-lg text-text-secondary/80 mb-8">
        You do not have permission to access this page. Please sign in with the
        correct account or return to the home page.
      </p>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="rounded-full bg-maroonCustom px-6 py-3 text-white font-semibold hover:bg-maroon-dark transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default UnauthorizedAccess;
