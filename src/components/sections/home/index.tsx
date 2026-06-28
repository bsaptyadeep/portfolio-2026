import { ContactCTASection } from "@/components/sections/home/contact-cta-section";
import { ExperienceTimelineSection } from "@/components/sections/home/experience-timeline-section";
import { FeaturedProjectsSection } from "@/components/sections/home/featured-projects-section";
import { HeroSection } from "@/components/sections/home/hero-section";
import { RecentBlogsSection } from "@/components/sections/home/recent-blogs-section";
import { SkillsSection } from "@/components/sections/home/skills-section";
import { TechStackSection } from "@/components/sections/home/tech-stack-section";
import {
  capabilities,
  homeTagline,
  techStackCategories,
} from "@/lib/data/seed";
import { getDisplayName } from "@/lib/utils";
import type { BlogPost, Profile, Project } from "@/types/database";
import type { ExperienceTimelineEntry } from "@/types/experience";

interface HomePageContentProps {
  profile: Profile;
  experiences: ExperienceTimelineEntry[];
  projects: Project[];
  posts: BlogPost[];
}

export function HomePageContent({
  profile,
  experiences,
  projects,
  posts,
}: HomePageContentProps) {
  const featuredProjects = projects.slice(0, 2);
  const recentPosts = posts.slice(0, 3);
  const displayName = getDisplayName(profile.full_name);

  return (
    <>
      <HeroSection
        name={displayName}
        title={profile.headline ?? "Senior Full Stack Engineer"}
        tagline={homeTagline}
        location={profile.location}
        avatarUrl={profile.avatar_url}
      />
      <SkillsSection skills={capabilities} />
      <ExperienceTimelineSection experiences={experiences} limit={3} />
      <FeaturedProjectsSection projects={featuredProjects} />
      <RecentBlogsSection posts={recentPosts} />
      <TechStackSection categories={techStackCategories} />
      <ContactCTASection
        name={displayName}
        email={profile.email}
      />
    </>
  );
}
