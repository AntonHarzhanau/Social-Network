import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Post } from "@/shared/api/post";
import ExpandableDescription from "@/shared/components/FeedCard/ExpandableDescription";
import { formatPostDate } from "@/shared/lib/date";
import Image from "@/shared/components/FeedCard/Image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/components/ui/carousel";
import { Toggle } from "@/shared/components/ui/toggle";
import { cn } from "@/shared/lib/utils";
import FeedCardHeader from "@/shared/components/FeedCard/FeedCardHeader";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";

interface FeedCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

const FeedCard = ({ post, onLike, onComment, onShare }: FeedCardProps) => {
  const images = post.media.filter((media) => media.type === "image");

  const authorName = post.author.username || "Unknown User";
  const initials = authorName
    .split(" ")
    .map((namePart) => namePart.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
  return (
    <Card className="max-w-full bg-card">
      <FeedCardHeader
        name={authorName}
        initials={initials}
        imageId={post.author.avatarUrl}
        date={formatPostDate(post.date)}
      />

      <CardContent className="w-full px-2">
        {images.length > 0 && (
          <Carousel className="w-full">
            <CarouselContent className="rounded-none gap-1">
              {images.map((media) => (
                <CarouselItem key={media.id} className="p-0 rounded-none">
                  <AspectRatio ratio={4 / 5} className="flex justify-center items-center bg-muted">
                    <Image mediaId={media.id} alt="Post Image" className="" />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
        <CardDescription className="whitespace-pre-wrap text-sm mt-2">
          {post.content && (
            <ExpandableDescription content={post.content} limit={200} />
          )}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center">
        <Toggle
          aria-label="Toggle like"
          size="sm"
          variant="default"
          pressed={post.isLikedByCurrentUser}
        //   onPressedChange={onToggleLike} 
          className="data-[state=on]:bg-transparent"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              post.isLikedByCurrentUser && "fill-red-400 stroke-red-400",
            )}
          />
          {post.likeCount}
        </Toggle>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-2"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{post.commentCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-2"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-xs">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeedCard;
