import { useEffect, useState } from "react";
import { useMedia } from "@/shared/hooks/useMedia";
import { cn } from "@/shared/lib/utils";

interface ImageProps {
  mediaId: string;
  alt?: string;
  className?: string;
}

const Image = ({ mediaId, alt, className }: ImageProps) => {
  const { data: blob, isLoading, isError } = useMedia(mediaId);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) return;
    const objectUrl = URL.createObjectURL(blob);
    setSrc(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [blob]);

  if (isError || !src) {
    return <div>Error loading image</div>;
  }

  if (isLoading) {
    return <div>Loading image...</div>;
  }

  return <img src={src} alt={alt} className={cn("object-fill", className)} />;
};

export default Image;
