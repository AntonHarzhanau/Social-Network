import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { getInitials } from "../lib/getInitials";
import { Skeleton } from "./ui/skeleton";
import { cn } from "../lib/utils";
import { useState } from "react";

interface UserAvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  alt?: string;
  className?: string;
}

export const UserAvatar = ({
  imageUrl,
  name,
  alt,
  className,
}: UserAvatarProps) => {
  const initials = getInitials(name);
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">(
    "loading",
  );

  return (
    <div className={className}>
      {status === "loading" && (
        <Skeleton className="w-full h-full rounded-full" />
      )}

      <Avatar className={cn("w-full h-full")}>
        <AvatarImage
          src={imageUrl || undefined}
          alt={alt}
          onLoadingStatusChange={setStatus}
          className="object-cover"
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </div>
  );
};
