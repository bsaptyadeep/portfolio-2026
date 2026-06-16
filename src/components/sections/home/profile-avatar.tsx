import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  name: string;
  src?: string | null;
  size?: "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  md: { container: "h-24 w-24", text: "text-2xl", image: 96 },
  lg: { container: "h-32 w-32 sm:h-40 sm:w-40", text: "text-3xl sm:text-4xl", image: 160 },
  xl: { container: "h-48 w-48 sm:h-56 sm:w-56", text: "text-4xl sm:text-5xl", image: 224 },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileAvatar({
  name,
  src,
  size = "lg",
  className,
  priority = false,
}: ProfileAvatarProps) {
  const { container, text, image } = sizeMap[size];
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-2xl p-[3px]",
        "bg-gradient-to-br from-primary via-violet-500 to-cyan-500",
        "shadow-xl shadow-primary/20",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[13px] bg-card",
          container
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={`${name} profile photo`}
            width={image}
            height={image}
            className="h-full w-full object-cover"
            priority={priority}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-violet-500/10 to-cyan-500/10"
            aria-hidden
          >
            <span className={cn("font-bold tracking-tight text-primary", text)}>
              {initials}
            </span>
          </div>
        )}
      </div>
      <div
        className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-primary/20 blur-2xl"
        aria-hidden
      />
    </div>
  );
}
