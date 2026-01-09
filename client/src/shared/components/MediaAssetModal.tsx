// shared/components/MediaAssetViewerModal.tsx
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import { useEffect, useMemo, useState } from "react";
import type { MediaResponse } from "@/entities/media/model/mediaResponseTypes";
import { MediaCarousel } from "@/shared/components/MediaCarousel";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

export type MediaModalAuthor = {
  id: string;
  username: string;
  avatarUrl?: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  author: MediaModalAuthor;
  medias: MediaResponse[];
  initialIndex: number;

  renderBottomActions: (ctx: {
    activeMedia: MediaResponse;
    activeIndex: number;
    total: number;
  }) => React.ReactNode;

  title?: string;
};

export function MediaAssetModal({
  open,
  onOpenChange,
  author,
  medias,
  initialIndex,
  renderBottomActions,
  title,
}: Props) {
  const safeInitial = useMemo(() => {
    if (!medias.length) return 0;
    return Math.max(0, Math.min(initialIndex, medias.length - 1));
  }, [initialIndex, medias.length]);

  const [activeIndex, setActiveIndex] = useState(safeInitial);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(safeInitial);
  }, [open, safeInitial]);

  const activeMedia = medias[activeIndex];
  if (!medias.length || !activeMedia) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
        <DialogContent>
            <DialogTitle hidden />
        </DialogContent>
    </Dialog>
 
  );
}
