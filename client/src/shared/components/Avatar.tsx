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
}

export const Avatar = ({ imageUrl, name, alt, className }: AvatarProps) => {
  const initials = getInitials(name);
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">(
    "loading",
  );

  return (
    <div className={cn("relative", className)}>
      {status === "loading" && (
        <Skeleton className="w-full h-full rounded-full" />
      )}

      <UIAvatar className="w-full h-full">
        <AvatarImage
          src={imageUrl || undefined}
          alt={alt}
          onLoadingStatusChange={setStatus}
          className="object-cover"
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </UIAvatar>

      {/* {isOnline && (
        <span
          className={cn(
            "absolute bottom-0 right-0",
            "h-3 w-3 rounded-full bg-green-500",
            "ring-2 ring-background",
          )}
          aria-label="Online"
          title="Online"
        />
      )} */}
    </div>
  );
};
