import { Download, ExternalLink, FileText } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResumeSectionProps {
  resumeUrl: string;
}

export function ResumeSection({ resumeUrl }: ResumeSectionProps) {
  return (
    <section className="mt-16" aria-labelledby="resume-heading">
      <FadeIn>
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <FileText className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <h2 id="resume-heading" className="text-2xl font-bold tracking-tight">
                    Resume
                  </h2>
                  <p className="mt-1 max-w-xl text-muted-foreground">
                    View or download my full CV as a PDF.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  View Resume
                </a>
                <a
                  href={resumeUrl}
                  download
                  className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Download PDF
                </a>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-xl border border-border/50 bg-muted/20">
              <iframe
                src={resumeUrl}
                title="Resume preview"
                className="h-[min(70vh,720px)] w-full"
              />
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </section>
  );
}
