import { href, Link } from "react-router-dom";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import type { UserPreview } from "@/entities/user/model/types";
import { useMyFriendsStats } from "@/entities/friends/model/useFriendsStats";
import { getUnreadChatCount } from "@/entities/chat/api/chat";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { MAIN_MENU } from "@/shared/constants/menu";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";

import { chatQueryKeys } from "@/entities/chat/model/chatQueryKeys";

interface MenuProps {
  user?: UserPreview | null;
  className?: string;
}

const formatBadge = (n: number) => (n > 99 ? "99+" : String(n));

const Menu = ({ user, className }: MenuProps) => {
  const enabled = !!user?.id;

  const { data: stats } = useMyFriendsStats(enabled);

  const unreadChatsQuery = useQuery({
    queryKey: chatQueryKeys.unread(),
    queryFn: getUnreadChatCount,
    enabled,
    initialData: 0,
  });

  const receivedCount = stats?.receivedRequests ?? 0;
  const unreadChatCount = unreadChatsQuery.data ?? 0;

  const friendsBadgeText = formatBadge(receivedCount);
  const messageBadgeText = formatBadge(unreadChatCount);

  return (
    <nav className={cn("sticky top-14", className)}>
      <Link
        to={href(ROUTES.PROFILE, { userId: user?.id || "" })}
        className="flex items-center"
      >
        <Button
          variant="ghost"
          className="w-full justify-start py-2 hover:bg-accent-foreground/5"
        >
          <User className="w-5 h-5" />
          <span className="font-normal">Profile</span>
        </Button>
      </Link>

      {MAIN_MENU.map((item) => {
        const Icon = item.icon;

        const showFriendsBadge =
          item.path === ROUTES.FRIENDS && receivedCount > 0;
        const showChatsBadge = item.path === "/chats" && unreadChatCount > 0;

        return (
          <Link to={item.path} key={item.path} className="flex items-center">
            <Button
              variant="ghost"
              className="w-full justify-start items-baseline py-2 px-3 hover:bg-accent-foreground/5 gap-2"
            >
              <div className="flex gap-2">
                <Icon className="w-5 h-5" />
                <span className="font-normal">{item.name}</span>

                {showFriendsBadge && (
                  <Badge variant="default" className="ml-auto">
                    {friendsBadgeText}
                  </Badge>
                )}

                {showChatsBadge && (
                  <Badge variant="default" className="ml-auto">
                    {messageBadgeText}
                  </Badge>
                )}
              </div>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

export default Menu;
