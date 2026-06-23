import { ExperienceDescription } from "@/components/experience/experience-description";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/experience/utils";
import type { Experience } from "@/types/database";

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const duration = formatDuration(experience);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-cyan-500" />
      <CardHeader className="pl-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{experience.role}</CardTitle>
              {experience.current && <Badge>Present</Badge>}
            </div>
            <p className="text-primary font-medium">{experience.company_name}</p>
          </div>
          <p className="text-sm text-muted-foreground">{duration}</p>
        </div>
        {experience.location && (
          <p className="text-sm text-muted-foreground">{experience.location}</p>
        )}
      </CardHeader>
      <CardContent className="pl-8">
        {experience.description && (
          <div className="mb-4">
            <ExperienceDescription
              content={experience.description}
              dialogTitle={`${experience.role} · ${experience.company_name}`}
            />
          </div>
        )}
        {experience.achievements.length > 0 && (
          <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {experience.achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <Badge key={tech} variant="glass">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
