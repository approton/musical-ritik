"use client";
import Pressable from "@/shared/ui/Pressable";
import { useTheme } from "./ThemeProvider";
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Pressable
      className="themeToggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-pressed={theme === "light"}
    >
      <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
      <span className="themeLabel">{theme === "dark" ? "Light" : "Dark"}</span>
    </Pressable>
  );
}
