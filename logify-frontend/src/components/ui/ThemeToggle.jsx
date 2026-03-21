import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_STORAGE_KEY = "logify-theme";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "dark") {
    return true;
  }

  if (storedTheme === "light") {
    return false;
  }

  return window.matchMedia(DARK_MEDIA_QUERY).matches;
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((current) => !current)}
      className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-border/80 bg-white text-maroon-dark shadow-sm transition-colors duration-300 hover:bg-gold/5 focus:outline-none focus:ring-2 focus:ring-gold dark:bg-slate-900 dark:text-gold dark:hover:bg-slate-800"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
        aria-hidden="true"
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
        aria-hidden="true"
      />
    </button>
  );
};

export default ThemeToggle;
