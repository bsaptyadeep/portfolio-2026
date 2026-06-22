import type { ExperienceMetric, ExperienceTimelineEntry } from "@/types/experience";
import type { Experience } from "@/types/database";

export function parseMetrics(raw: unknown): ExperienceMetric[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is ExperienceMetric =>
        typeof item === "object" &&
        item !== null &&
        "label" in item &&
        "value" in item &&
        typeof (item as ExperienceMetric).label === "string" &&
        typeof (item as ExperienceMetric).value === "string"
    )
    .map((item) => ({ label: item.label, value: item.value }));
}

export function toTimelineEntry(row: Experience): ExperienceTimelineEntry {
  return {
    id: row.id,
    company_name: row.company_name,
    company_logo: row.company_logo,
    role: row.role,
    location: row.location,
    start_date: row.start_date,
    end_date: row.current ? null : row.end_date,
    current: row.current,
    description: row.description,
    achievements: row.achievements ?? [],
    technologies: row.technologies ?? [],
    metrics: parseMetrics(row.metrics),
    sort_order: row.sort_order,
    published: row.published,
  };
}

export function formatDuration(entry: Pick<
  ExperienceTimelineEntry,
  "start_date" | "end_date" | "current"
>) {
  const start = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(entry.start_date));

  if (entry.current) return `${start} — Present`;

  const end = entry.end_date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
      }).format(new Date(entry.end_date))
    : "";

  return end ? `${start} — ${end}` : start;
}

export function formatTenure(entry: Pick<
  ExperienceTimelineEntry,
  "start_date" | "end_date" | "current"
>) {
  const start = new Date(entry.start_date);
  const end = entry.current ? new Date() : entry.end_date ? new Date(entry.end_date) : new Date();

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) return `${remainingMonths} mo`;
  if (remainingMonths === 0) return `${years} yr${years > 1 ? "s" : ""}`;
  return `${years} yr${years > 1 ? "s" : ""} ${remainingMonths} mo`;
}
