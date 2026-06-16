"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { ResolvedTheme, ThemeMode } from "@/lib/theme/constants";

interface UseThemeReturn {
  /** User preference: light | dark | system */
  theme: ThemeMode | undefined;
  /** Resolved appearance after system preference */
  resolvedTheme: ResolvedTheme | undefined;
  setTheme: (theme: ThemeMode) => void;
  mounted: boolean;
}

export function useTheme(): UseThemeReturn {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return {
    theme: theme as ThemeMode | undefined,
    resolvedTheme: resolvedTheme as ResolvedTheme | undefined,
    setTheme: setTheme as (theme: ThemeMode) => void,
    mounted,
  };
}
