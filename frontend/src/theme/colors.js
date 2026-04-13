export const lightColors = {
  // Base
  bg: "#EEF2FF",          // soft indigo-tinted background
  card: "#FFFFFF",

  // Text
  text: "#0B132B",        // slightly richer dark text
  mutedText: "#667085",
  placeholder: "#98A2B3",

  // Brand
  primary: "#4F46E5",

  // Borders / surfaces
  border: "#D8E0EE",
  subtle: "#F8FAFC",

  // Status
  danger: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
};

export const darkColors = {
  // Base
  bg: "#0B1020",          // deeper dark base
  card: "#121A2B",        // more premium surface

  // Text
  text: "#F8FAFC",
  mutedText: "#98A2B3",
  placeholder: "#667085",

  // Brand
  primary: "#6366F1",

  // Borders / surfaces
  border: "rgba(255,255,255,0.08)",
  subtle: "#0F172A",

  // Status
  danger: "#F87171",
  success: "#34D399",
  warning: "#FBBF24",
};

// convenience helper (optional)
export const getColors = (mode) => (mode === "dark" ? darkColors : lightColors);

export default lightColors;