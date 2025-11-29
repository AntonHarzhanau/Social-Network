// import { LikeButton } from "@/shared/components/LikeButton";
import { LikeButton } from "@/shared/components/LikeButton";
import { Button } from "@/shared/components/ui/button";
import { useToggleLikePost } from "@/shared/hooks/useToggleLikePost";
import { MessageCircle, Share2 } from "lucide-react";

interface FeedCardActionsProps {
  postId: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
}

const FeedCardActions = ({
  postId,
  likeCount,
  commentCount,
  isLikedByCurrentUser,
}: FeedCardActionsProps) => {
  const toggleLike = useToggleLikePost();
  return (
    <div className="flex items-center gap-1">
      <LikeButton
        count={likeCount}
        isActive={isLikedByCurrentUser}
        onClick={() => toggleLike.mutate(postId)}
      />

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 px-2"
        // onClick={onCommentClick}
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-xs">{commentCount}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 px-2"
        // onClick={onShareClick}
      >
        <Share2 className="h-4 w-4" />
        <span className="text-xs">Share</span>
      </Button>
    </div>
  );
};

export default FeedCardActions;
