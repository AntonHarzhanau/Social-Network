import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/shared/components/ui/card";
import ExpandableDescription from "@/shared/components/ExpandableDescription";
import FeedCardHeader from "@/entities/post/ui/FeedCardHeader";
import FeedCardActions from "./FeedCardActions";
import type { Post } from "../model/types";
import { useMediaViewerStore } from "@/features/media/viewer/useMediaViewerStore";
import FeedDetails from "./FeedDetails";
import { useState } from "react";
import { FeedMediaCarousel } from "@/entities/media/ui/FeedMediaCarousel";

interface FeedCardProps {
  post: Post;
}

const FeedCard = ({ post }: FeedCardProps) => {
  const openViewer = useMediaViewerStore((s) => s.openViewer);
  const [feedDetailsOpen, setFeedDetailsOpen] = useState(false);

  return (
    <>
      <Card
        className="max-w-full bg-card"
        data-testid="post-card"
        data-post-id={post.id}
      >
        <FeedCardHeader post={post} />

        <CardContent className="w-full px-2">
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
