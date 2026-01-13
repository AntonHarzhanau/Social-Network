import { Link } from "react-router-dom";
import { CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { UserAvatar } from "@/shared/components/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useDeletePost } from "../model/usePostMutations";
import { sessionStore } from "@/entities/session/model/sessionStore";

interface FeedCardHeaderProps {
  userId: string;
  name: string;
  avatarUrl?: string | null;
  date: string;
  postId: string;
}

const FeedCardHeader = ({
  userId,
  name,
  avatarUrl,
  date,
  postId,
}: FeedCardHeaderProps) => {
  const { mutateAsync: deletePost } = useDeletePost();
  const user = sessionStore((s) => s.user);
  return (
    <CardHeader className="flex items-center gap-3">
      {name !== "[deleted]" ? (
        <>
          <Link to={`/profile/${userId}`} className="">
            <UserAvatar
              imageUrl={avatarUrl}
              name={name}
              alt={name}
              className="w-10 h-10"
            />
          </Link>
          <div className="flex flex-col">
            <Link
              to={`/profile/${userId}`}
              className="text-sm font-semibold hover:underline"
            >
              {name}
            </Link>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </>
      ) : (
        <>
          <Link to={`/notfound`} className="">
            <UserAvatar
              imageUrl={"/public/deletedUserImage.png"}
              name={name}
              alt={name}
              className="w-10 h-10"
            />
          </Link>
          <div className="flex flex-col">
            <Link
              to={`/notfound`}
              className="text-sm font-semibold hover:underline"
            >
              {"Deleted User"}
            </Link>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto p-2 hover:bg-accent-foreground/5"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {user?.id === userId && (
            <DropdownMenuItem
              onClick={async () => await deletePost(postId)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </CardHeader>
  );
};

export default FeedCardHeader;
