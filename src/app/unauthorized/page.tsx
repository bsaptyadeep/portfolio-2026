import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Unauthorized",
  noIndex: true,
});

export default function UnauthorizedPage() {
  return (
    <div className="gradient-mesh flex min-h-dvh items-center justify-center px-4">
      <div className="glass max-w-md rounded-2xl p-8 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldX className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-3 text-muted-foreground">
          This area is restricted to administrators. Contact the site owner if you need access.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to Site
          </Link>
          <Link href="/login" className={cn(buttonVariants())}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
