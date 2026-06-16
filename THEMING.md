# Theming System

Enterprise-grade design token architecture with light, dark, and system themes.

## Architecture

```
Primitives (palette)     →  semantic-light.css / semantic-dark.css
        ↓
Typography · Spacing · Radius · Elevation · Motion · Components
        ↓
globals.css @theme inline  →  Tailwind utilities
        ↓
UI components (button, card, input…) reference component tokens
```

## Token Layers

| Layer | File | Purpose |
|-------|------|---------|
| Primitives | `src/styles/tokens/primitives.css` | Raw palette (neutral, indigo, status) |
| Semantic light | `semantic-light.css` | Purpose-based colors (`--background`, `--primary`) |
| Semantic dark | `semantic-dark.css` | Dark overrides on `.dark` |
| Typography | `typography.css` | Font sizes, weights, line heights |
| Spacing | `spacing.css` | 4px-based scale (`--space-1` … `--space-32`) |
| Radius | `radius.css` | `--radius-xs` … `--radius-full` |
| Elevation | `elevation.css` | Shadows and z-index scale |
| Motion | `motion.css` | Durations, easings, transition presets |
| Components | `components.css` | Button, input, card, nav dimensions |

## Theme Modes

| Mode | Behavior |
|------|----------|
| **Light** | Forces light semantic tokens |
| **Dark** | Adds `.dark` class to `<html>` |
| **System** | Follows `prefers-color-scheme` |

Persistence: `localStorage` key `portfolio-theme` via `next-themes`.

## Usage

### React

```tsx
import { useTheme, ThemeSwitcher } from "@/lib/theme";

const { theme, resolvedTheme, setTheme } = useTheme();
setTheme("dark"); // "light" | "dark" | "system"
```

### CSS

```css
.my-element {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--surface-elevated);
  box-shadow: var(--shadow-md);
  transition: var(--transition-colors);
}
```

### Tailwind

```tsx
<div className="bg-surface-elevated text-foreground p-4 rounded-xl shadow-lg" />
<p className="text-caption" />
<h1 className="text-heading-1" />
```

### TypeScript helpers

```ts
import { colorVar, spaceVar, radiusVar } from "@/lib/theme";

const style = { padding: spaceVar("4"), color: colorVar("primary") };
```

## Color System

**Surfaces:** `background`, `surface`, `surface-elevated`, `card`  
**Brand:** `primary`, `primary-hover`, `primary-muted`  
**Feedback:** `success`, `warning`, `info`, `destructive`  
**Interactive:** `link`, `link-hover`, `ring`, `accent`

## Component Tokens

Components read from `components.css`:

- `--button-height-md`, `--button-radius`, `--button-shadow`
- `--input-height`, `--input-radius`, `--input-bg`
- `--card-radius`, `--card-padding`, `--card-border`
- `--nav-height`, `--sidebar-width`

Update tokens once — all components inherit changes.

## Files

| Path | Role |
|------|------|
| `src/lib/theme/` | Constants, TS token registry, `useTheme` hook |
| `src/components/theme/theme-switcher.tsx` | Header dropdown + settings segmented control |
| `src/components/providers/theme-provider.tsx` | `next-themes` wrapper |
| `src/app/globals.css` | Token imports + Tailwind `@theme` bridge |
