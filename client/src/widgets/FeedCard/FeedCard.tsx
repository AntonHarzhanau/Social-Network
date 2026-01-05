import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/shared/components/ui/card";
import { type Post } from "@/shared/api/post";
import ExpandableDescription from "@/shared/components/ExpandableDescription";
import { formatPostDate } from "@/shared/lib/date";
import FeedCardHeader from "@/widgets/FeedCard/FeedCardHeader";
import FeedCardActions from "./FeedCardActions";
import MediaCarousel from "../../shared/components/MediaCarousel";

interface FeedCardProps {
  post: Post;
}

const FeedCard = ({ post }: FeedCardProps) => {
  const authorName = post.author.username;
  return (
    <Card className="max-w-full bg-card">
      <FeedCardHeader
        userId={post.author.id}
        name={authorName}
        avatarUrl={post.author.avatarUrl}
        date={formatPostDate(post.date)}
      />

      <CardContent className="w-full px-2">
        <MediaCarousel medias={post.media} />
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
  );
};

export default FeedCard;
