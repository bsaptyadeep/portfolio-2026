import { HomePageContent } from "@/components/sections/home";
import { getBlogPosts, getExperienceTimeline, getProfile, getProjects } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const profile = await getProfile();
  return createMetadata({
    title: "Home",
    description:
      profile.bio ??
      "Senior Full Stack Engineer portfolio — building scalable, accessible web experiences.",
    profile,
  });
}

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
