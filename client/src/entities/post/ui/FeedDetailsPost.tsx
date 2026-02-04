import type { Post } from "../model/types";
import FeedCardHeader from "@/entities/post/ui/FeedCardHeader";
import ExpandableDescription from "@/shared/components/ExpandableDescription";
import { FeedMediaCarousel } from "@/entities/media/ui/FeedMediaCarousel";
import { useMediaViewerStore } from "@/features/media/viewer/useMediaViewerStore";
import FeedCardActions from "./FeedCardActions";

interface FeedDetailsPostProps {
  post: Post;
}

const FeedDetailsPost = ({ post }: FeedDetailsPostProps) => {
  const openViewer = useMediaViewerStore((s) => s.openViewer);

  return (
    <div className="w-full">
      <FeedCardHeader post={post} className="px-4 pt-4 pb-2" />

      <div className="px-4 pb-3">
        <FeedMediaCarousel
          medias={post.media}
          onItemClick={(_, index) => {
            openViewer({
              author: post.author,
              medias: post.media ?? [],
              initialIndex: index,
            });
          }}
          className="w-full"
        />

        {post.content && (
          <div className="whitespace-pre-wrap break-all wrap-anywhere min-w-0 max-w-full text-sm mt-3">
            <ExpandableDescription content={post.content} limit={400} />
          </div>
        )}

        <div className="mt-3 flex items-center">
          <FeedCardActions
            postId={post.id}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            isLikedByCurrentUser={post.isLikedByCurrentUser}
          />
        </div>
      </div>

      <div className="border-b" />
    </div>
  );
};

export default FeedDetailsPost;
