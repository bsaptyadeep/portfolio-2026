import { Suspense } from "react";
import { getProfile } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";
import { getDisplayName } from "@/lib/utils";
import LoginForm from "./login-form";

export async function generateMetadata() {
  const profile = await getProfile();
  return createMetadata({ title: "Sign In", noIndex: true, profile });
}

export default async function LoginPage() {
  const profile = await getProfile();
  const siteName = getDisplayName(profile.full_name);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-muted-foreground">
          Loading...
        </div>
      }
    >
      <LoginForm siteName={siteName} />
    </Suspense>
  );
}
