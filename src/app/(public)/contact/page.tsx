import { ContactPageContent } from "@/app/(public)/contact/contact-form";
import { getProfile } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact",
  description: "Get in touch for collaborations, opportunities, or just to say hello.",
  path: "/contact",
});

export default async function ContactPage() {
  const profile = await getProfile();

  return <ContactPageContent email={profile.email} location={profile.location} />;
}
