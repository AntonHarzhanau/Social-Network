import { Button } from "@/shared/components/ui/button";
import { useInfinitePosts } from "@/shared/hooks/useInfinitePosts";
import FeedCard from "@/widgets/FeedCard/FeedCard";

const FeedsPage = () => {
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
    <div className="flex gap-2 p-2">
      <div className="flex flex-col flex-5 gap-2">
        {posts && posts.map((post) => <FeedCard key={post.id} post={post} />)}

        {isFetchingNextPage && (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Loding more...
          </div>
        )}

        {hasNextPage && <div ref={loadMoreRef} className="h-4 w-full" />}
      </div>

      <aside className="flex-3 flex flex-col gap-2 h-fit rounded-xl bg-card sticky top-14 p-2">
        <Button variant="ghost" className="w-full justify-start">
          All
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Friends
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Groups
        </Button>
      </aside>
    </div>
  );
};

export default FeedsPage;
