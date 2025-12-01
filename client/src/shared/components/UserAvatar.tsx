// UserAvatar.tsx
import { useEffect, useState } from "react";
import { useMedia } from "@/shared/hooks/useMedia";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { getInitials } from "../lib/getInitials";

interface UserAvatarProps {
  imageId?: string | null;
  name: string;
  alt?: string;
  className?: string;
}

export const UserAvatar = ({
  imageId,
  name,
  alt,
  className,
}: UserAvatarProps) => {
  const initials = getInitials(name);
  const { data: blob, isLoading, isError } = useMedia(imageId);

  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) {
        setSrc(null);
        return;
    }
    
    const objectUrl = URL.createObjectURL(blob);
    setSrc(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [blob]);

  const showFallback = !imageId || isLoading || isError || !src;

  return (
    <Avatar className={className}>
      {showFallback ? (
        <AvatarFallback>{initials}</AvatarFallback>
      ) : (
        <AvatarImage src={src} alt={alt} className="object-cover"/>
      )}
    </Avatar>
  );
};
