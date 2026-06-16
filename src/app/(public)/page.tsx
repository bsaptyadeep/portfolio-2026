import { HomePageContent } from "@/components/sections/home";
import { getBlogPosts, getExperienceTimeline, getProfile, getProjects } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Home",
  description:
    "Senior Full Stack Engineer portfolio — building scalable, accessible web experiences.",
});

export default async function HomePage() {
  const [profile, experiences, projects, posts] = await Promise.all([
    getProfile(),
    getExperienceTimeline({ limit: 3 }),
    getProjects(),
    getBlogPosts(),
  ]);

  return (
    <HomePageContent
      profile={profile}
      experiences={experiences}
      projects={projects}
      posts={posts}
    />
  );
}
