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

  //   if (isLoading) {
  //     return <Skeleton className={cn("h-8 w-8 rounded-full", className)} />;
  //   }

  return (
    <div className={className}>
      {status !== "loaded" && (
        <Skeleton className={cn("h-10 w-10 rounded-full", className)} />
      )}

      <Avatar className={cn("h-10 w-10", status !== "loaded" && "invisible")}>
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
