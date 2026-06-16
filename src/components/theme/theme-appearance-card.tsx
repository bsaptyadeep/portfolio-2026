"use client";

import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/lib/theme/use-theme";

export function ThemeAppearanceCard() {
  const { theme, resolvedTheme, mounted } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Choose how the site looks. System follows your OS preference.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ThemeSwitcher variant="segmented" />
        {mounted && (
          <p className="text-sm text-muted-foreground">
            Preference: <span className="font-medium text-foreground capitalize">{theme}</span>
            {theme === "system" && resolvedTheme && (
              <> · Currently <span className="font-medium text-foreground">{resolvedTheme}</span></>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
