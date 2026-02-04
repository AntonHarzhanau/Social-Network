import { getUnreadChatCount } from "@/entities/chat/api/chat";
import { chatQueryKeys } from "@/entities/chat/model/chatQueryKeys";
import { useMyFriendsStats } from "@/entities/friends/model/useFriendsStats";
import { sessionStore } from "@/entities/session/model/sessionStore";
import type { UserPreview } from "@/entities/user/model/types";
import { MAIN_MENU } from "@/shared/constants/menu";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

interface Props {
  user?: UserPreview | null;
}

const formatBadge = (n: number) => (n > 99 ? "99+" : String(n));

export default function MobileBottomNav({}: Props) {
  const user = sessionStore((s) => s.user);
  const enabled = !!user?.id;

  const { data: stats } = useMyFriendsStats(enabled);

  const unreadChatsQuery = useQuery({
    queryKey: chatQueryKeys.unread(),
    queryFn: getUnreadChatCount,
    enabled,
    placeholderData: 0,
    refetchOnMount: "always",
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });

  const receivedCount = stats?.receivedRequests ?? 0;
  const unreadChatCount = unreadChatsQuery.data ?? 0;

  const friendsBadgeText = formatBadge(receivedCount);
  const chatsBadgeText = formatBadge(unreadChatCount);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t bg-card">
      <div className="mx-auto max-w-[1100px] px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="h-14 grid grid-cols-4 items-center">
          {MAIN_MENU.map((item) => {
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
