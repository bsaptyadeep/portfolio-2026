import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface ExperienceMarkdownProps {
  content: string;
  className?: string;
}

export function ExperienceMarkdown({ content, className }: ExperienceMarkdownProps) {
  return (
    <div className={cn("prose-experience", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p({ children }) {
            return (
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground last:mb-0 sm:text-base">
                {children}
              </p>
            );
          },
          strong({ children }) {
            return <strong className="font-semibold text-foreground">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic text-foreground/90">{children}</em>;
          },
          ul({ children }) {
            return (
              <ul className="my-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground sm:text-base">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="my-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground sm:text-base">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
