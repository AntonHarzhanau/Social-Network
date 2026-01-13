import type { MediaDetail } from "@/entities/media/model/types";
import { LikeButton } from "@/shared/components/LikeButton";
import { Button } from "@/shared/components/ui/button";
import { Share2 } from "lucide-react";

interface MediaModalControlsProps {
  mediaDetail: MediaDetail;
  onToggleLike: () => void;
}

const MediaModalControls = ({ mediaDetail, onToggleLike }: MediaModalControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <LikeButton count={mediaDetail.likeCount} isActive={mediaDetail.likedByCurrentUser} onClick={onToggleLike} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-zinc-200 hover:text-white gap-2"
        // onClick={onShare}
      >
        <Share2 className="h-4 w-4" />
        Поделиться
      </Button>
    </div>
  );
};

export default MediaModalControls;
