/**
 * Design token registry — TypeScript mirror of CSS custom properties.
 * Use for documentation, tooling, and typed access in JS.
 */

export const colorTokens = [
  "background",
  "foreground",
  "surface",
  "surface-elevated",
  "surface-overlay",
  "card",
  "card-foreground",
  "primary",
  "primary-hover",
  "primary-foreground",
  "primary-muted",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
  "border",
  "border-subtle",
  "input",
  "ring",
  "link",
  "link-hover",
] as const;

export const typographyTokens = {
  fontSize: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"] as const,
  fontWeight: ["normal", "medium", "semibold", "bold"] as const,
  lineHeight: ["none", "tight", "snug", "normal", "relaxed", "loose"] as const,
  letterSpacing: ["tighter", "tight", "normal", "wide", "wider", "widest"] as const,
} as const;

export const spacingTokens = [
  "0", "px", "0-5", "1", "1-5", "2", "2-5", "3", "3-5", "4",
  "5", "6", "7", "8", "9", "10", "11", "12", "14", "16", "20", "24", "32",
] as const;

export const radiusTokens = [
  "none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "full",
] as const;

export const componentTokens = [
  "button-height-sm",
  "button-height-md",
  "button-height-lg",
  "button-radius",
  "input-height",
  "input-radius",
  "card-radius",
  "card-padding",
  "nav-height",
  "sidebar-width",
] as const;

export type ColorToken = (typeof colorTokens)[number];
export type SpacingToken = (typeof spacingTokens)[number];
export type RadiusToken = (typeof radiusTokens)[number];

/** Read a CSS variable value at runtime (client only). */
export function getToken(name: string, fallback = ""): string {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

/** Reference a semantic color token as a CSS var() string. */
export function colorVar(token: ColorToken): string {
  return `var(--${token})`;
}

/** Reference a spacing token as a CSS var() string. */
export function spaceVar(token: SpacingToken): string {
  return `var(--space-${token})`;
}

/** Reference a radius token as a CSS var() string. */
export function radiusVar(token: RadiusToken): string {
  return `var(--radius-${token})`;
}
