import { MessageCircle, Newspaper, User, Users } from "lucide-react";
import { href } from "react-router-dom";
import { ROUTES } from "./routes";

export type MenuItem = {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const MAIN_MENU: MenuItem[] = [
  { path: href(ROUTES.PROFILE, { userId: "me" }), name: "Profile", icon: User },
  { path: "/feeds", name: "Feed", icon: Newspaper },
  { path: "/messages", name: "Messages", icon: MessageCircle },
  { path: "/friends", name: "Friends", icon: Users },
  { path: "/groups", name: "Groups", icon: Users },
  { path: "/settings", name: "Settings", icon: Users },
];
