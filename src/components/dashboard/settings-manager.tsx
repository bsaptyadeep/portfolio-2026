"use client";

import { useOptimistic, useTransition, useState } from "react";
import { ThemeAppearanceCard } from "@/components/theme/theme-appearance-card";
import { AlertBanner, ConfirmDeleteButton } from "@/components/dashboard/alert-banner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  deleteContactMessage,
  markMessageRead,
} from "@/lib/actions/admin/settings";
import { formatDate } from "@/lib/utils";
import type { ContactMessage } from "@/types/database";

interface SettingsManagerProps {
  messages: ContactMessage[];
}

type Action =
  | { type: "read"; id: string; read: boolean }
  | { type: "delete"; id: string };

function reducer(messages: ContactMessage[], action: Action) {
  switch (action.type) {
    case "read":
      return messages.map((m) => (m.id === action.id ? { ...m, read: action.read } : m));
    case "delete":
      return messages.filter((m) => m.id !== action.id);
    default:
      return messages;
  }
}

export function SettingsManager({ messages }: SettingsManagerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimistic, update] = useOptimistic(messages, reducer);

  return (
    <div className={isPending ? "opacity-80 transition-opacity" : ""}>
      <PageHeader
        title="Settings"
        description="Site configuration and contact messages."
      />

      {error && <AlertBanner message={error} onDismiss={() => setError(null)} />}

      <div className="mt-8">
        <ThemeAppearanceCard />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">NEXT_PUBLIC_SITE_URL</span> — Public site
            URL for SEO
          </p>
          <p>
            <span className="font-medium text-foreground">NEXT_PUBLIC_SUPABASE_URL</span> — Supabase
            project URL
          </p>
          <p>
            Promote admin:{" "}
            <code className="rounded bg-muted px-1">
              UPDATE profiles SET role = &apos;admin&apos; WHERE email = &apos;you@example.com&apos;;
            </code>
          </p>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Contact Messages</h2>
        {optimistic.length === 0 ? (
          <EmptyState
            title="No messages"
            description="Contact form submissions will appear here."
          />
        ) : (
          <div className="space-y-4">
            {optimistic.map((msg) => (
              <Card key={msg.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{msg.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{msg.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(msg.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={msg.read}
                        label={`Mark message from ${msg.name} as read`}
                        disabled={isPending}
                        onCheckedChange={(read) => {
                          startTransition(async () => {
                            update({ type: "read", id: msg.id, read });
                            const r = await markMessageRead(msg.id, read);
                            if (!r.success) setError(r.error);
                          });
                        }}
                      />
                      <Badge variant={msg.read ? "secondary" : "default"}>
                        {msg.read ? "Read" : "Unread"}
                      </Badge>
                    </div>
                    <ConfirmDeleteButton
                      disabled={isPending}
                      onConfirm={() => {
                        startTransition(async () => {
                          update({ type: "delete", id: msg.id });
                          const r = await deleteContactMessage(msg.id);
                          if (!r.success) setError(r.error);
                        });
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {msg.subject && (
                    <p className="mb-2 text-sm font-medium">{msg.subject}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{msg.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
