import { useInfinitePosts } from "@/entities/post/model/useInfinitePosts";
import FeedCard from "../entities/post/ui/FeedCard";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";
import { usePostFilterStore } from "@/features/post/post-filter/model/usePostFilterStore";
const FeedsList = ({ wallId = null }: { wallId?: string | null }) => {
  const filter = usePostFilterStore((s) => s.filter);
  const {
    posts,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfinitePosts({ limit: 10, wallId, filter });

  const sentinelRef = useInfiniteScrollSentinel({
    enabled: !isLoading && !isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

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

      <div ref={sentinelRef} className="h-10" />
    </div>
  );
};

export default FeedsList;
