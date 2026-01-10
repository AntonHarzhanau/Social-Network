import { useMemo, useState } from "react";
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
import { MediaAssetModal } from "@/widgets/media-modal/MediaAssetModal";
import type { MediaResponse } from "@/entities/media/model/types";
import type { Post } from "../model/types";

interface FeedCardProps {
  post: Post;
}

const FeedCard = ({ post }: FeedCardProps) => {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const authorName = post.author.username;

  const medias = post.media as MediaResponse[] | null;

  const author = useMemo(
    () => ({
      id: post.author.id,
      username: post.author.username,
      avatarUrl: post.author.avatarUrl ?? null,
    }),
    [post.author.id, post.author.username, post.author.avatarUrl],
  );

  return (
    <>
      <Card className="max-w-full bg-card">
        <FeedCardHeader
          userId={post.author.id}
          name={authorName}
          avatarUrl={post.author.avatarUrl}
          date={formatPostDate(post.date)}
        />

        <CardContent className="w-full px-2">
          <MediaCarousel
            layout="feed"
            medias={medias}
            onItemClick={(_, index) => {
              setInitialIndex(index);
              setIsMediaOpen(true);
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
          />
        </CardFooter>
      </Card>

      {/* MODAL */}
      {medias && medias.length > 0 && (
        <MediaAssetModal
          open={isMediaOpen}
          onOpenChange={setIsMediaOpen}
          author={author}
          medias={medias}
          initialIndex={initialIndex}
        />
      )}
    </>
  );
};

export default FeedCard;
