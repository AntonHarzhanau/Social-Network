import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/shared/components/ui/card";
import { type Post } from "@/entities/post/api/postApi";
import ExpandableDescription from "@/shared/components/ExpandableDescription";
import { formatPostDate } from "@/shared/lib/date";
import FeedCardHeader from "@/entities/post/ui/FeedCardHeader";
import FeedCardActions from "./FeedCardActions";
import { MediaCarousel } from "@/shared/components/MediaCarousel";
import { useMemo, useState } from "react";
import { MediaAssetModal } from "@/shared/components/MediaAssetModal";
import { Button } from "@/shared/components/ui/button";

interface FeedCardProps {
  post: Post;
}

const FeedCard = ({ post }: FeedCardProps) => {
  const authorName = post.author.username;
  const [mediaOpen, setMediaOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const medias = post.media ?? [];

  const author = useMemo(
    () => ({
      id: post.author.id,
      username: post.author.username,
      avatarUrl: post.author.avatarUrl,
    }),
    [post.author],
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
            items={post.media}
            toAsset={(m) => ({
              id: m.id,
              url: m.url,
              type: m.fileType === "video" ? "video" : "image",
            })}
            onItemClick={(_, idx) => {
              setInitialIndex(idx);
              setMediaOpen(true);
            }}
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
        {/* Модалка медиа ассета */}
      </Card>

      {medias.length > 0 && (
        <MediaAssetModal
          open={mediaOpen}
          onOpenChange={setMediaOpen}
          author={author}
          medias={medias}
          initialIndex={initialIndex}
          title={post.content?.slice(0, 60) || undefined}
          renderBottomActions={({ activeMedia }) => (
            <>
              <Button
                variant="secondary"
                onClick={() => console.log("save", activeMedia.id)}
              >
                Сохранить себе
              </Button>
              <Button
                variant="secondary"
                onClick={() => console.log("share", activeMedia.id)}
              >
                Поделиться
              </Button>
            </>
          )}
        />
      )}
    </>
  );
};

export default FeedCard;
