import { useThemeMode } from "./ThemeContext";

export function useAppTheme() {
  const { isDark } = useThemeMode();

  return {
    isDark,
    colors: {
      background_Screen: isDark ? "#000000" : "#1A4DBE",
      background_Auth: isDark ? "#000000" : "#ffff",
      background: isDark ? "#000000" : "#ffff",
      card: isDark ? "#0F1724" : "#F3F4F6",

      // TEXT
      text: isDark ? "#ffff" : "#000000", // 111827
      subText: isDark ? "#E5E7EB" : "#6B7280",

      // ICONS
      icon: isDark ? "#FFFFFF" : "#0A145A",
      iconBg: isDark ? "#1E2A6D" : "#DBEAFE",

      

      // BUTTONS
      primary: isDark ? "#1A4DBE" : "#0A145A",
      primaryText: isDark ? "#000000" : "#FFFFFF",
    },
  };
}
