import { MessageCircle, Newspaper,  Users } from "lucide-react";

export type MenuItem = {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const MAIN_MENU: MenuItem[] = [
  { path: "/feeds", name: "Feed", icon: Newspaper },
  { path: "/messages", name: "Messages", icon: MessageCircle },
  { path: "/friends", name: "Friends", icon: Users },
  { path: "/groups", name: "Groups", icon: Users },
  { path: "/settings", name: "Settings", icon: Users },
];
