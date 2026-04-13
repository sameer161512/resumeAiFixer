// src/theme/ThemeContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getColors } from "./colors";

const ThemeContext = createContext(null);
const KEY = "theme_mode"; // "light" | "dark"

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(KEY);
      if (saved === "light" || saved === "dark") setMode(saved);
    })();
  }, []);

  const value = useMemo(() => {
    return {
      mode,
      colors: getColors(mode),
      toggle: async () => {
        const next = mode === "dark" ? "light" : "dark";
        setMode(next);
        await AsyncStorage.setItem(KEY, next);
      },
      setMode: async (next) => {
        setMode(next);
        await AsyncStorage.setItem(KEY, next);
      },
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
