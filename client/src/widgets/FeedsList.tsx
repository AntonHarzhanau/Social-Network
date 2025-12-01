import { useInfinitePosts } from "@/shared/hooks/useInfinitePosts";
import FeedCard from "./FeedCard/FeedCard";

const FeedsList = () => {
  const {
    posts,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    loadMoreRef,
  } = useInfinitePosts(10);

  if (isLoading && posts.length === 0) {
    return <div>Loading...</div>;
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
