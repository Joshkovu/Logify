import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App1 from "./pages/dashboards/InternshipAdmin/App1.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App1 />
  </StrictMode>,
);
