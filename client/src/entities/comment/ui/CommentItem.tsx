import { Avatar } from "@/shared/components/Avatar";
import type { CommentResponse } from "../model/types";
import { Item } from "@/shared/components/ui/item";
import { formatPostDate } from "@/shared/lib/date";
// import { Button } from "@/shared/components/ui/button";
import { LikeButton } from "@/shared/components/LikeButton";
import { useToggleLikeCommentMutation } from "../model/useCommentMutations";
import ExpandableDescription from "@/shared/components/ExpandableDescription";

interface CommentItemProps {
  threadId: string;
  comment: CommentResponse;
}

const CommentItem = ({ threadId, comment }: CommentItemProps) => {
  const likeMut = useToggleLikeCommentMutation(threadId);

  return (
    <Item variant="default" className="flex-col items-start">
      {/* Author Info */}
      <div className="flex gap-2 items-center">
        <Avatar
          name={comment.author?.name}
          imageUrl={comment.author?.avatarUrl}
          className="h-10 w-10"
        />
        <div>
          <p>{comment.author?.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatPostDate(comment.createdAt)}
          </p>
        </div>
      </div>

      {/* Comment Content */}
      <div className="font-normal whitespace-pre-wrap break-all wrap-anywhere min-w-0 max-w-full text-sm ">
        <ExpandableDescription content={comment.content} limit={100} />
      </div>

      {/* Actions*/}
      <div className="flex justify-end w-full items-center">
        {/* <Button className="p-0" variant="link">
          <p className="text-sm font-normal">reply</p> ({comment.replyCount})
        </Button> */}
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
