import { useState, useEffect } from "react";
import { HiMoon, HiSun } from "react-icons/hi";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed top-4 right-4 p-3 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300"
    >
      {dark ? (
        <HiSun className="text-yellow-400 w-6 h-6" />
      ) : (
        <HiMoon className="text-gray-800 w-6 h-6" />
      )}
    </button>
  );
}
