import { Link } from "react-router-dom";
import { CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { UserAvatar } from "@/shared/components/UserAvatar";

interface FeedCardHeaderProps {
  name: string;
  avatarUrl?: string | null;
  date: string;
}

const FeedCardHeader = ({ name, avatarUrl, date }: FeedCardHeaderProps) => {
  return (
    <CardHeader className="flex items-center gap-3">
      <Link to="/profile" className="">
        <UserAvatar imageUrl={avatarUrl} name={name} alt={name} className="w-10 h-10"/>
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
