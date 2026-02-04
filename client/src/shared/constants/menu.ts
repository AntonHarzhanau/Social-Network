import { Handshake, MessageCircle, Newspaper, Users } from "lucide-react";
import { ROUTES } from "./routes";

export type MenuItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const MAIN_MENU: MenuItem[] = [
  { path: ROUTES.FEEDS, name: "Feed", icon: Newspaper },
  { path: "/chats", name: "Messages", icon: MessageCircle },
  { path: ROUTES.FRIENDS, name: "Friends", icon: Handshake },
  { path: ROUTES.GROUPS, name: "Groups", icon: Users },
  //   { path: ROUTES.SETTINGS, name: "Settings", icon: Settings },
];
