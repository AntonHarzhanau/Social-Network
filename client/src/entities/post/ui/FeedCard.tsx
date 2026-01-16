import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/shared/components/ui/card";
import ExpandableDescription from "@/shared/components/ExpandableDescription";
import { formatPostDate } from "@/shared/lib/date";
import FeedCardHeader from "@/entities/post/ui/FeedCardHeader";
import FeedCardActions from "./FeedCardActions";
import MediaCarousel from "../../media/ui/MediaCarousel";
import type { Post } from "../model/types";
import { useMediaViewerStore } from "@/features/media/viewer/useMediaViewerStore";
import FeedDetails from "./FeedDetails";
import { useState } from "react";

interface FeedCardProps {
  post: Post;
}

const FeedCard = ({ post }: FeedCardProps) => {
  const openViewer = useMediaViewerStore((s) => s.openViewer);
  const [feedDetailsOpen, setFeedDetailsOpen] = useState(false);

  return (
    <>
      <Card className="max-w-full bg-card">
        <FeedCardHeader
          userId={post.author.id}
          name={post.author.name}
          avatarUrl={post.author.avatarUrl}
          date={formatPostDate(post.createdAt)}
          postId={post.id}
        />

        <CardContent className="w-full px-2">
          <MediaCarousel
            layout="feed"
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

          <CardDescription className="whitespace-pre-wrap break-all wrap-anywhere min-w-0 max-w-full text-sm mt-2">
            {post.content && (
              <ExpandableDescription content={post.content} limit={200} />
            )}
          </CardDescription>
        </CardContent>

        <CardFooter className="flex items-center">
          <FeedCardActions
            postId={post.id}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            isLikedByCurrentUser={post.isLikedByCurrentUser}
            onCommentClick={() => setFeedDetailsOpen(true)}
          />
        </CardFooter>
      </Card>
      <FeedDetails
        post={post}
        open={feedDetailsOpen}
        onOpenChange={setFeedDetailsOpen}
      />
    </>
  );
};

export default FeedCard;
