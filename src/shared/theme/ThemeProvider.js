"use client";
import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext(null);
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    function restore() {
      let saved = "dark";
      try {
        saved = localStorage.getItem("ritik-theme") || "dark";
      } catch {}
      const next = saved === "light" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      setTheme(next);
    }
    restore();
    addEventListener("storage", restore);
    return () => removeEventListener("storage", restore);
  }, []);
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("ritik-theme", next);
    } catch {}
  }
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  return useContext(ThemeContext);
}
