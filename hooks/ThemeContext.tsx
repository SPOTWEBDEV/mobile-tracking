import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");

  const isDark =
    mode === "system" ? systemScheme === "dark" : mode === "dark";

  const setMode = async (value: ThemeMode) => {
    setModeState(value);
    await AsyncStorage.setItem("APP_THEME", value);
  };

  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("ThemeProvider missing");
  return ctx;
}
