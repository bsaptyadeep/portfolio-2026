import { MapPin } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProfile } from "@/lib/cms/queries";
import { skills } from "@/lib/data/seed";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description: "Learn more about my background, skills, and approach to building software.",
  path: "/about",
});

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <FadeIn>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About Me</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {profile.bio}
        </p>
      </FadeIn>

      {profile.location && (
        <FadeIn delay={0.1}>
          <p className="mt-4 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden />
            {profile.location}
          </p>
        </FadeIn>
      )}

      <section className="mt-16" aria-labelledby="skills-heading">
        <FadeIn>
          <h2 id="skills-heading" className="text-2xl font-bold tracking-tight">
            Skills & Technologies
          </h2>
          <p className="mt-2 text-muted-foreground">
            Tools and technologies I work with daily
          </p>
        </FadeIn>

        <StaggerContainer className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <StaggerItem key={skill}>
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                  <span className="font-medium">{skill}</span>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="mt-16" aria-labelledby="approach-heading">
        <FadeIn>
          <h2 id="approach-heading" className="text-2xl font-bold tracking-tight">
            My Approach
          </h2>
        </FadeIn>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "User-Centered",
              description:
                "Every decision starts with the end user. Accessibility and performance are non-negotiable.",
            },
            {
              title: "Scalable Architecture",
              description:
                "Clean abstractions, typed APIs, and patterns that grow with your team and product.",
            },
            {
              title: "Ship & Iterate",
              description:
                "Deliver value early, measure impact, and continuously improve based on real feedback.",
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={0.1 * i}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <Badge className="mb-3">{String(i + 1).padStart(2, "0")}</Badge>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
