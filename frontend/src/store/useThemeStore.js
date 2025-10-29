import { create } from "zustand";

export const useThemeSelector = create((set) => ({
    theme: localStorage.getItem("theme") || "light",
    setTheme : (theme) => {
        localStorage.setItem("theme", theme);
        set({ theme });
    },
}))