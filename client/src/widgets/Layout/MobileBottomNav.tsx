import type { UserPreview } from "@/entities/user/model/types";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";
import { Home, MessageCircle, Settings, Users, UsersRound } from "lucide-react";
import { NavLink } from "react-router-dom";

interface Props {
  user?: UserPreview | null;
}

const mobilePrimary = [
  { name: "Feed", path: ROUTES.HOME, icon: Home },
  { name: "Messages", path: "/chats", icon: MessageCircle },
  { name: "Friends", path: ROUTES.FRIENDS, icon: Users },
  { name: "Groups", path: ROUTES.GROUPS, icon: UsersRound },
  { name: "Settings", path: ROUTES.SETTINGS, icon: Settings },
];

export default function MobileBottomNav({}: Props) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t bg-card">
      <div className="mx-auto max-w-[1100px] px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="h-14 grid grid-cols-5 items-center">
          {mobilePrimary.map((item) => {
            const Icon = item.icon;
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
                <Icon className="w-6 h-6" />
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
