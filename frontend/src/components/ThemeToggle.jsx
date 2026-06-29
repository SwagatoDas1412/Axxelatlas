import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const getInitialTheme = () => {
    return localStorage.getItem("theme") || "dark";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle light and dark mode"
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb">
          {theme === "dark" ? "🌙" : "☀️"}
        </span>
      </span>
      <span className="theme-toggle-label">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}