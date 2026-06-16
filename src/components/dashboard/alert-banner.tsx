"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteButtonProps {
  onConfirm: () => void | Promise<void>;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function ConfirmDeleteButton({
  onConfirm,
  disabled,
  label = "Delete",
  className,
}: ConfirmDeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Sure?</span>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={loading}
          onClick={handleConfirm}
        >
          {loading ? "..." : "Yes"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={loading}
          onClick={() => setConfirming(false)}
        >
          No
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={() => setConfirming(true)}
      className={cn("text-destructive hover:text-destructive", className)}
      aria-label={label}
    >
      <Trash2 className="h-4 w-4" aria-hidden />
    </Button>
  );
}

interface AlertBannerProps {
  message: string;
  variant?: "default" | "destructive" | "success";
  onDismiss?: () => void;
}

export function AlertBanner({ message, variant = "destructive", onDismiss }: AlertBannerProps) {
  return (
    <Alert variant={variant} className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-xs underline underline-offset-2"
          >
            Dismiss
          </button>
        )}
      </div>
    </Alert>
  );
}
