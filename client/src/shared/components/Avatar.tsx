import {
  Avatar as UIAvatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { getInitials } from "../lib/getInitials";
import { Skeleton } from "./ui/skeleton";
import { cn } from "../lib/utils";
import { useState } from "react";

interface AvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  alt?: string;
  className?: string;

  isOnline?: boolean;
  shape?: "circle" | "square";
}

export const Avatar = ({
  imageUrl,
  name,
  alt,
  className,
  isOnline = false,
  shape = "circle",
}: AvatarProps) => {
  const initials = getInitials(name);
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">(
    "loading",
  );

  const isCircle = shape === "circle";
  const rounding = isCircle ? "rounded-full" : "rounded-md";
  const indicatorRounding = "rounded-full";

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 overflow-visible",
        className,
      )}
    >
      <UIAvatar className={cn("h-full w-full overflow-hidden", rounding)}>
        {Boolean(imageUrl) && status === "loading" && (
          <Skeleton
            className={cn("absolute inset-0 h-full w-full", rounding)}
          />
        )}

        <AvatarImage
          src={imageUrl || undefined}
          alt={alt}
          onLoadingStatusChange={setStatus}
          className="h-full w-full object-cover"
        />

        <AvatarFallback
          className={cn(
            "h-full w-full flex items-center justify-center",
            rounding,
          )}
        >
          {initials}
        </AvatarFallback>
      </UIAvatar>

      {isOnline && (
        <span
          className={cn(
            "absolute bottom-[7%] right-[7%]",
            "size-[clamp(8px,12%,18px)]",
            indicatorRounding,
            "bg-green-500 ring-2 ring-background",
          )}
        />
      )}
    </div>
  );
};
