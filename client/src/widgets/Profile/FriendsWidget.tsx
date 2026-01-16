import { fetchFriends } from "@/entities/friends/api/friends";
import type { UserPreview } from "@/entities/user/model/types";
import { Card, CardTitle } from "@/shared/components/ui/card";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { ROUTES } from "@/shared/constants/routes";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface FriendsWidgetProps {
    userId: string | undefined;
}

const FriendsWidget = ({ userId }: FriendsWidgetProps) => {
    const [friends, setFriends] = useState<UserPreview[]>([]);

    useEffect(() => {
        fetchFriends(userId).then(setFriends);
    }, [userId]);


  return (
    <div>
      <Card className="h-56 p-3">
        <CardTitle>
          <div className="flex items-baseline gap-2">
            <Link to={ROUTES.FRIENDS} className="text-sm font-medium hover:underline">
              Friends
            </Link>
            <p className="text-xs text-muted-foreground">177</p>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {friends.map((friend) => (
              <Link key={friend.id} to={`/profile/${friend.id}`} className="group flex flex-col items-center gap-1  no-underline">
                  <UserAvatar imageUrl={friend.avatarUrl} name={friend.name} alt="Friend Avatar" className="h-10 w-10" />
                <p className="text-xs font-light group-hover:underline">{friend.name.split(" ")[0]}</p>
              </Link>
            ))}
          </div>
        </CardTitle>
      </Card>
    </div>
  );
};

export default FriendsWidget;
