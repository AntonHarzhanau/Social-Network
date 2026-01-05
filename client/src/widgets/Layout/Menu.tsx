import type { Me } from "@/features/auth/api/authApi";
import { Button } from "@/shared/components/ui/button";
import { MAIN_MENU } from "@/shared/constants/menu";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";
import { User } from "lucide-react";
import { href, Link } from "react-router-dom";

interface MenuProps {
  user?: Me | null;
  className?: string;
}
const Menu = ({ user, className }: MenuProps) => {
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
              className="w-full justify-start py-2 hover:bg-accent-foreground/5"
            >
              <Icon className="w-5 h-5" />
              <span className="font-normal">{item.name}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

export default Menu;
