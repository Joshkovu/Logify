import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import NotFound from "./components/NotFound";
// import App3 from "./pages/dashboards/WorkplaceSupervisor/pages/App3";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <App3 /> */}
    <NotFound />
  </React.StrictMode>,
);
