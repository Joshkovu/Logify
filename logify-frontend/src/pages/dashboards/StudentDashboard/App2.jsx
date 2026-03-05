import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import InternshipPlacement from "./pages/InternshipPlacement.jsx";
import Sidebar from "./Sidebar.jsx";
const App2 = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/internshipplacement"
              element={<InternshipPlacement />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App2;
