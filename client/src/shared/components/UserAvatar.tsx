// UserAvatar.tsx
import { useEffect, useState } from "react";
import { useMedia } from "@/shared/hooks/useMedia";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";

interface UserAvatarProps {
  imageId?: string | null;
  initials: string;
  alt?: string;
  className?: string;
}

export const UserAvatar = ({
  imageId,
  initials,
  alt,
  className,
}: UserAvatarProps) => {
  const [src, setSrc] = useState<string | null>(null);
  const { data: blob, isLoading, isError } = useMedia(imageId!);

  useEffect(() => {
    if (!blob) return;
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
        <AvatarImage src={src} alt={alt} />
      )}
    </Avatar>
  );
};
