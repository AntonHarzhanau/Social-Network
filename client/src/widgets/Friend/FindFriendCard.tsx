import type { UserPreview } from "@/entities/user/model/types";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar } from "@/shared/components/Avatar";
import { cn } from "@/shared/lib/utils";
import { Link } from "react-router-dom";

interface FindFriendCardProps {
  user: UserPreview;
  onSendRequest: (userId: string) => void;
  disabled?: boolean;
  label?: string;
}

export function FindFriendCard({
  user,
  onSendRequest,
  disabled,
  label,
}: FindFriendCardProps) {
  return (
    <Card
      className={cn(
        "p-0 rounded-md flex flex-col items-center gap-2 bg-card cursor-pointer",
        "hover:transition-transform hover:scale-105",
      )}
    >
      <Link 
      className="w-full h-full"
      to={`/profile/${user.id}`}>
        <Avatar
          imageUrl={user.avatarUrl}
          name={user.name}
          shape="square"
          className="w-full aspect-square rounded-none"
        />

        <div className="text-center">
          <div className="text-sm font-medium leading-tight">{user.name}</div>
        </div></Link>

      <Button
        className="w-full"
        disabled={disabled}
        onClick={() => onSendRequest(user.id)}
      >
        {label ?? "+ Send Request"}
      </Button>
    </Card>
  );
}
