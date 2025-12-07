import { useInfinitePosts } from "@/shared/hooks/useInfinitePosts";
import FeedCard from "./FeedCard/FeedCard";

const FeedsList = ({ authorId = null }: { authorId?: string | null }) => {
  const {
    posts,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    loadMoreRef,
  } = useInfinitePosts(10, authorId);

  if (isLoading && posts.length === 0) {
    return Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="h-32 w-full animate-pulse bg-muted rounded-md"
      />
    ));
  }

  if (isError) {
    return <div>Error loading posts.</div>;
  }
  return (
    <div className="flex flex-col gap-2">
      {posts && posts.map((post) => <FeedCard key={post.id} post={post} />)}

      {isFetchingNextPage && (
        <div className="py-4 text-center text-sm text-muted-foreground">
          Loding more...
        </div>
      )}

      {hasNextPage && <div ref={loadMoreRef} className="h-4 w-full" />}
    </div>
  );
};

export default FeedsList;
