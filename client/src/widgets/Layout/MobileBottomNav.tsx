import { getUnreadChatCount } from "@/entities/chat/api/chat";
import { chatQueryKeys } from "@/entities/chat/model/chatQueryKeys";
import { useMyFriendsStats } from "@/entities/friends/model/useFriendsStats";
import { sessionStore } from "@/entities/session/model/sessionStore";
import type { UserPreview } from "@/entities/user/model/types";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Handshake,
  Home,
  MessageCircle,
  Settings,
  UsersRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface Props {
  user?: UserPreview | null;
}

const mobilePrimary = [
  { name: "Feed", path: ROUTES.HOME, icon: Home },
  { name: "Messages", path: "/chats", icon: MessageCircle },
  { name: "Friends", path: ROUTES.FRIENDS, icon: Handshake },
  { name: "Groups", path: ROUTES.GROUPS, icon: UsersRound },
  { name: "Settings", path: ROUTES.SETTINGS, icon: Settings },
];

const formatBadge = (n: number) => (n > 99 ? "99+" : String(n));

export default function MobileBottomNav({}: Props) {
  const user = sessionStore((s) => s.user);
  const enabled = !!user?.id;

  const { data: stats } = useMyFriendsStats(enabled);

  const ureadChatQuery = useQuery({
    queryKey: chatQueryKeys.unread(),
    queryFn: getUnreadChatCount,
    enabled,
    initialData: 0,
  });

  const receivedCount = stats?.receivedRequests ?? 0;
  const unreadChatCount = ureadChatQuery.data ?? 0;

  const friendsBadgeText = formatBadge(receivedCount);
  const chatsBadgeText = formatBadge(unreadChatCount);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t bg-card">
      <div className="mx-auto max-w-[1100px] px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="h-14 grid grid-cols-5 items-center">
          {mobilePrimary.map((item) => {
            const Icon = item.icon;

            const showFriendsBadge =
              item.path === ROUTES.FRIENDS && receivedCount > 0;
            const showChatsBadge =
              item.path === "/chats" && unreadChatCount > 0;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-center h-14",
                    isActive && "text-primary",
                  )
                }
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />

                  {showFriendsBadge && (
                    <span
                      className="
                       absolute top-2 left-3
                      min-w-5 h-5 px-1
                      rounded-full
                      text-[11px] leading-5 text-center
                      bg-destructive text-destructive-foreground
                    "
                    >
                      {friendsBadgeText}
                    </span>
                  )}

                  {showChatsBadge && (
                    <span
                      className="
                       absolute top-2 left-3
                      min-w-5 h-5 px-1
                      rounded-full
                      text-[11px] leading-5 text-center
                      bg-destructive text-destructive-foreground
                    "
                    >
                      {chatsBadgeText}
                    </span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
