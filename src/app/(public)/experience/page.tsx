import { ExperienceTimeline } from "@/components/experience";
import { FadeIn } from "@/components/motion/fade-in";
import { getExperienceTimeline } from "@/lib/cms/experience";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Experience",
  description: "Professional experience and career journey as a Senior Full Stack Engineer.",
  path: "/experience",
});

export default async function ExperiencePage() {
  const experiences = await getExperienceTimeline();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <FadeIn>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Career</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Experience Timeline
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          A chronological journey through roles, impact metrics, and the technologies that
          powered each chapter.
        </p>
      </FadeIn>

      <div className="mt-14 sm:mt-20">
        <ExperienceTimeline entries={experiences} />
      </div>
    </div>
  );
}
