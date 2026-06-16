import { Suspense } from "react";
import { createMetadata } from "@/lib/seo";
import LoginForm from "./login-form";

export const metadata = createMetadata({
  title: "Sign In",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-muted-foreground">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
