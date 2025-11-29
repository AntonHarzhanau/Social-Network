import { Link } from "react-router-dom";
import { CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { UserAvatar } from "../UserAvatar";

interface FeedCardHeaderProps {
  name: string;
  initials: string;
  imageId?: string;
  date: string;
}

const FeedCardHeader = ({
  name,
  initials,
  imageId,
  date,
}: FeedCardHeaderProps) => {
  return (
    <CardHeader className="flex items-center gap-3">
      <Link to="/profile" className="">
        <UserAvatar
          imageId={imageId}
          initials={initials}
          alt={name}
          className="h-10 w-10"
        />
      </Link>
      <div className="flex flex-col">
        <Link to="/profile" className="text-sm font-semibold hover:underline">
          {name}
        </Link>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto p-2 hover:bg-accent-foreground/5"
      >
        <MoreHorizontal />
      </Button>
    </CardHeader>
  );
};

export default FeedCardHeader;
