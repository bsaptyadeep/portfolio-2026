/** Theme mode identifiers — matches next-themes values. */
export const THEME_MODES = ["light", "dark", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

/** localStorage key for theme persistence. */
export const THEME_STORAGE_KEY = "portfolio-theme";

/** Resolved appearance (never "system"). */
export type ResolvedTheme = "light" | "dark";

export const THEME_LABELS: Record<ThemeMode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};
