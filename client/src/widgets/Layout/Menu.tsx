import { getUnreadChatCount } from "@/entities/chat/api/chat";
import { useMyFriendsStats } from "@/entities/friends/model/useFriendsStats";
import type { UserPreview } from "@/entities/user/model/types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { MAIN_MENU } from "@/shared/constants/menu";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { href, Link } from "react-router-dom";

interface MenuProps {
  user?: UserPreview | null;
  className?: string;
}
const Menu = ({ user, className }: MenuProps) => {
  const { data: stats } = useMyFriendsStats(!!user?.id);

  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const receivedCount = stats?.receivedRequests ?? 0;
  const friendsBadgeText = receivedCount > 99 ? "99+" : String(receivedCount);
  const messageBadgeText =
    unreadChatCount > 99 ? "99+" : String(unreadChatCount);

  useEffect(() => {
    if (!user) return;
    const fetchUnreadChatCount = async () => {
      const response = await getUnreadChatCount();
      setUnreadChatCount(response);
    };
    fetchUnreadChatCount();
  }, []);

  return (
    <nav className={cn("sticky top-14 ", className)}>
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

        return (
          <Link to={item.path} key={item.path} className="flex items-center">
            <Button
              variant="ghost"
              className="w-full justify-start items-baseline py-2 hover:bg-accent-foreground/5"
            >
              <Icon className="w-5 h-5" />
              <span className="font-normal">{item.name}</span>

              {item.path === ROUTES.FRIENDS && receivedCount > 0 && (
                <Badge variant="default" className="w-4 h-4">
                  {friendsBadgeText}
                </Badge>
              )}
              {item.path === "/chats" && unreadChatCount > 0 && (
                <Badge variant="default" className="w-4 h-4">
                  {messageBadgeText}
                </Badge>
              )}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

export default Menu;
