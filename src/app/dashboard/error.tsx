"use client";

import { useEffect } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="max-w-md space-y-4">
        <Alert variant="destructive">
          <p className="font-medium">Something went wrong</p>
          <p className="mt-1 text-sm opacity-90">{error.message}</p>
        </Alert>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
