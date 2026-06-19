import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Avatar } from "@/shared/components/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useDeletePost } from "../model/usePostMutations";
import type { Post } from "../model/types";
import { formatPostDate } from "@/shared/lib/date";
import { cn } from "@/shared/lib/utils";

interface FeedCardHeaderProps {
  post: Post;
  className?: string;
}

const FeedCardHeader = ({ post, className }: FeedCardHeaderProps) => {
  const { mutateAsync: deletePost } = useDeletePost();

  const isGroupPost = post.wallOwner?.type === "group";

  const ownerName = post.wallOwner?.name ?? "";
  const isDeletedOwner = !isGroupPost && ownerName === "[deleted]";

  const headerHref = isDeletedOwner
    ? "/notfound"
    : isGroupPost
      ? `/groups/${post.wallOwner?.id}`
      : `/profile/${post.wallOwner?.id}`;

  const headerTitle = isDeletedOwner ? "Deleted User" : ownerName;

  const headerAvatarUrl = isDeletedOwner
    ? "/public/deletedUserImage.png"
    : (post.wallOwner?.avatarUrl ?? null);

  return (
    <div className={cn("flex items-center gap-3 p-4", className)}>
      <Link to={headerHref}>
        <Avatar
          imageUrl={headerAvatarUrl}
          name={headerTitle}
          alt={headerTitle}
          isOnline={post.wallOwner?.isOnline ?? false}
          className="w-10 h-10"
        />
      </Link>

      <div className="flex flex-col min-w-0">
        <Link
          to={headerHref}
          className="text-sm font-semibold hover:underline truncate"
        >
          {headerTitle}
        </Link>

        <span className="text-xs text-muted-foreground">
          {formatPostDate(post.createdAt)}
        </span>
      </div>

      {post.canDelete && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto p-2 hover:bg-accent-foreground/5"
              aria-label="Open post menu"
              data-testid="post-menu-trigger"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={async () => await deletePost(post.id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default FeedCardHeader;
