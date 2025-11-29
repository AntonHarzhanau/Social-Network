// import { LikeButton } from "@/shared/components/LikeButton";
import { Button } from "@/shared/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface FeedCardActionsProps {
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;

  onLikeClick?: () => void;
  onCommentClick?: () => void;
  onShareClick?: () => void;
}

const FeedCardActions = ({
  likeCount,
  commentCount,
  isLikedByCurrentUser,
  onLikeClick,
  onCommentClick,
  onShareClick,
}: FeedCardActionsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 px-2"
        onClick={onLikeClick}
      >
        <Heart
          className={
            isLikedByCurrentUser ? "h-4 w-4 fill-red-400 stroke-red-400" : "h-4 w-4"
          }
        />
        <span className="text-xs">{likeCount}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 px-2"
        onClick={onCommentClick}
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-xs">{commentCount}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 px-2"
        onClick={onShareClick}
      >
        <Share2 className="h-4 w-4" />
        <span className="text-xs">Share</span>
      </Button>
    </div>
  );
};

export default FeedCardActions;
