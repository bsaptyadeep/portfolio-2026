"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { MermaidDiagram } from "@/components/blog/mermaid-diagram";
import "highlight.js/styles/github-dark.css";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, rehypeHighlight]}
      components={{
        h2({ children, ...props }) {
          return (
            <h2 className="scroll-mt-24" {...props}>
              {children}
            </h2>
          );
        },
        h3({ children, ...props }) {
          return (
            <h3 className="scroll-mt-24" {...props}>
              {children}
            </h3>
          );
        },
        img({ src, alt }) {
          if (!src || typeof src !== "string") return null;
          return (
            <span className="my-6 block overflow-hidden rounded-xl border border-border/50">
              <Image
                src={src}
                alt={alt ?? ""}
                width={800}
                height={450}
                className="h-auto w-full object-cover"
                unoptimized={src.startsWith("http")}
              />
            </span>
          );
        },
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className ?? "");
          const lang = match?.[1];
          const code = String(children).replace(/\n$/, "");

          if (lang === "mermaid") {
            return <MermaidDiagram chart={code} />;
          }

          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          return (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm" {...props}>
              {children}
            </code>
          );
        },
        pre({ children }) {
          return (
            <pre className="my-4 overflow-x-auto rounded-xl border border-border/50 bg-[#0d1117] p-4 text-sm">
              {children}
            </pre>
          );
        },
        table({ children }) {
          return (
            <div className="my-6 overflow-x-auto rounded-xl border border-border/50">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="border-b border-border/50 bg-muted/50 px-4 py-2 text-left font-semibold">
              {children}
            </th>
          );
        },
        td({ children }) {
          return <td className="border-b border-border/30 px-4 py-2">{children}</td>;
        },
        a({ href, children }) {
          return (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-primary underline-offset-4 hover:underline"
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
