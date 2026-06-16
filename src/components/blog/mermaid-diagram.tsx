"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "strict",
    });

    const render = async () => {
      if (!ref.current) return;
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, chart);
        ref.current.innerHTML = svg;
      } catch {
        ref.current.textContent = "Invalid Mermaid diagram";
      }
    };

    render();
  }, [chart]);

  return (
    <div
      ref={ref}
      className="my-6 overflow-x-auto rounded-xl border border-border/50 bg-muted/30 p-4"
      aria-label="Diagram"
    />
  );
}
