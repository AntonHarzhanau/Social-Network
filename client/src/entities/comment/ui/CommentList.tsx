import CommentItem from "./CommentItem";
import { useComments } from "../model/useComment";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";

interface CommentListProps {
  threadId: string;
}

const CommentList = ({ threadId }: CommentListProps) => {
  const {
    comments,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useComments(threadId);
  const sentinelRef = useInfiniteScrollSentinel({
    enabled: !isLoading && !isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <div className="flex flex-col relative">
        {comments.map((comment) => (
          <CommentItem key={comment.id} threadId={threadId} comment={comment} />
        ))}
      <div ref={sentinelRef}/>
      
    </div>
  );
};

export default CommentList;
