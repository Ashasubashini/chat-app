import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: (() => localStorage.getItem("chat-theme") || "coffee")(), // Function to get theme
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
