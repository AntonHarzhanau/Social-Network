import { Button } from "@/shared/components/ui/button";
import { Heart, Share2 } from "lucide-react";

interface MediaModalControlsProps {
  likeCount: number;
  onToggleLike?: () => void;
  onShare?: () => void;
}

const MediaModalControls = ({ likeCount, onToggleLike, onShare }: MediaModalControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-zinc-200 hover:text-white gap-2"
        onClick={onToggleLike}
      >
        <Heart className="h-4 w-4" />
        {likeCount}
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-zinc-200 hover:text-white gap-2"
        onClick={onShare}
      >
        <Share2 className="h-4 w-4" />
        Поделиться
      </Button>
    </div>
  );
};

export default MediaModalControls;
