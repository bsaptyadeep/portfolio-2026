"use client";

import Image from "next/image";
import { useState } from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md";
  className?: string;
}

const sizeMap = {
  sm: { box: "h-10 w-10", text: "text-sm", image: 40 },
  md: { box: "h-12 w-12", text: "text-base", image: 48 },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CompanyLogo({ name, src, size = "md", className }: CompanyLogoProps) {
  const [error, setError] = useState(false);
  const { box, text, image } = sizeMap[size];
  const showImage = src && !error;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm",
        box,
        className
      )}
    >
      {showImage ? (
        <Image
          src={src}
          alt={`${name} logo`}
          width={image}
          height={image}
          className="h-full w-full object-contain p-1.5"
          onError={() => setError(true)}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-violet-500/10"
          aria-hidden
        >
          {name.length <= 3 ? (
            <Building2 className="h-5 w-5 text-primary" />
          ) : (
            <span className={cn("font-bold text-primary", text)}>{getInitials(name)}</span>
          )}
        </div>
      )}
    </div>
  );
}
