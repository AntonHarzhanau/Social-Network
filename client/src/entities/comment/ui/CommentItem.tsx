import { UserAvatar } from "@/shared/components/UserAvatar";
import type { CommentResponse } from "../model/types";
import { Item } from "@/shared/components/ui/item";
import { formatPostDate } from "@/shared/lib/date";
import { Button } from "@/shared/components/ui/button";
import { LikeButton } from "@/shared/components/LikeButton";
import { useToggleLikeCommentMutation } from "../model/useCommentMutations";


interface CommentItemProps {
  threadId: string;
  comment: CommentResponse;
}

const CommentItem = ({ threadId, comment }: CommentItemProps) => {
    const likeMut = useToggleLikeCommentMutation(threadId);
    

  return (
    <Item variant="default" className="flex-col items-start">
      {/* Author Info */}
      <div className="flex gap-2">
        <UserAvatar
          name={comment.author?.username}
          imageUrl={comment.author?.avatarUrl}
          className="h-10 w-10"
        />
        <p>{comment.author.username}</p>
      </div>

      {/* Comment Content */}
      <p>{comment.content}</p>

      {/* Actions*/}
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-4 items-center">
          <p>{formatPostDate(comment.createdAt)}</p>
          <Button variant="link">Reply ({comment.replyCount})</Button>
        </div>
        <LikeButton
          count={comment.likeCount}
          isActive={comment.likedByCurrentUser}
          onClick={() => likeMut.mutate(comment.id)}
          disabled={likeMut.isPending}
        />
      </div>
    </Item>
  );
};

export default CommentItem;
