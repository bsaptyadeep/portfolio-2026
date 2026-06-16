"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { THEME_LABELS, THEME_MODES, type ThemeMode } from "@/lib/theme/constants";
import { useTheme } from "@/lib/theme/use-theme";
import { cn } from "@/lib/utils";

const THEME_ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Laptop,
};

interface ThemeSwitcherProps {
  className?: string;
  /** Compact icon-only trigger (header). */
  variant?: "dropdown" | "segmented";
}

export function ThemeSwitcher({ className, variant = "dropdown" }: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Theme" className={className}>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const ActiveIcon = resolvedTheme === "dark" ? Moon : Sun;

  if (variant === "segmented") {
    return (
      <div
        className={cn(
          "inline-flex rounded-xl border border-border bg-muted/50 p-1",
          className
        )}
        role="radiogroup"
        aria-label="Theme preference"
      >
        {THEME_MODES.map((mode) => {
          const Icon = THEME_ICONS[mode];
          const isActive = theme === mode;
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setTheme(mode)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {THEME_LABELS[mode]}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Change theme"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(!open)}
      >
        <ActiveIcon className="h-5 w-5" />
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-[var(--z-dropdown)] mt-2 min-w-[10rem] rounded-xl border border-border bg-card p-1 shadow-lg"
        >
          {THEME_MODES.map((mode) => {
            const Icon = THEME_ICONS[mode];
            const isActive = theme === mode;
            return (
              <button
                key={mode}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setTheme(mode);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="flex-1 text-left">{THEME_LABELS[mode]}</span>
                {isActive && <Check className="h-4 w-4" aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
