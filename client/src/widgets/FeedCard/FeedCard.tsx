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
import FeedCardMedia from "./FeedCardMedia";
import FeedCardActions from "./FeedCardActions";
import { useToggleLikePost } from "@/shared/hooks/useToggleLikePost";

interface FeedCardProps {
  post: Post;

  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

const FeedCard = ({ post, onComment, onShare }: FeedCardProps) => {
  const toggleLike = useToggleLikePost();
  const authorName = post.author.username || "Unknown User";
  const initials = authorName
    .split(" ")
    .map((namePart) => namePart.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  const handleLike = () => {
    toggleLike.mutate(post.id);
  }
  const handleComment = () => onComment?.(post.id);
  const handleShare = () => onShare?.(post.id);

  return (
    <Card className="max-w-full bg-card">
      <FeedCardHeader
        name={authorName}
        initials={initials}
        imageId={post.author.avatarUrl}
        date={formatPostDate(post.date)}
      />

      <CardContent className="w-full px-2">
        <FeedCardMedia media={post.media} />
        <CardDescription className="whitespace-pre-wrap text-sm mt-2">
          {post.content && (
            <ExpandableDescription content={post.content} limit={200} />
          )}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center">
        <FeedCardActions
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          isLikedByCurrentUser={post.isLikedByCurrentUser}
          onLikeClick={handleLike}
          onCommentClick={handleComment}
          onShareClick={handleShare}
        />
      </CardFooter>
    </Card>
  );
};

export default FeedCard;
