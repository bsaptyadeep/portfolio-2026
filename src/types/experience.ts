export interface ExperienceMetric {
  label: string;
  value: string;
}

export interface ExperienceTimelineEntry {
  id: string;
  company_name: string;
  company_logo: string | null;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string | null;
  achievements: string[];
  technologies: string[];
  metrics: ExperienceMetric[];
  sort_order: number;
  published: boolean;
}
