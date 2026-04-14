import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const THEME_STORAGE_KEY = "logify-theme";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
const prefersDark = window.matchMedia(DARK_MEDIA_QUERY).matches;
const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;
document.documentElement.classList.toggle("dark", shouldUseDark);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
