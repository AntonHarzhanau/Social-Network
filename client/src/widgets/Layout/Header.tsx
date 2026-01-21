import { authActions } from "@/features/auth/model/authActions";
import type { UserPreview } from "@/entities/user/model/types";
import { ModeToggle } from "@/shared/components/ModeToggle";
import { Button } from "@/shared/components/ui/button";
import { Avatar } from "@/shared/components/Avatar";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  user?: UserPreview | null;
}

const Header = ({ user }: HeaderProps) => {
  const { logout } = authActions;
  return (
    <header className="flex justify-center h-12 border border-b items-center bg-card px-4 sticky top-0 z-20">
      <div className="flex items-center max-w-[1100px] w-full justify-between">
        <Link to="/" className="w-40">
          Logo
        </Link>

        <div className="flex items-center gap-5">
          <Button variant="ghost">
            <Bell className="w-6 h-6" />
          </Button>
          <ModeToggle />
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>

          <Button asChild variant="ghost" className="w-8 h-8 p-0 rounded-full">
            <Avatar name={user?.name} imageUrl={user?.avatarUrl} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
