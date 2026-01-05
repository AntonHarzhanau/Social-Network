import type { Me } from "@/features/auth/api/authApi";
import { ModeToggle } from "@/shared/components/ModeToggle";
import SearchInput from "@/shared/components/SearchInput";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  user?: Me | null;
  isLoading: boolean;
  logout: () => void;
}

const Header = ({ user, isLoading, logout }: HeaderProps) => {

  return (
    <header className="flex justify-center h-12 border border-b items-center bg-card px-4 sticky top-0 z-20">
      <div className="flex items-center max-w-[1100px] w-full justify-between">
        <div className="flex gap-8 items-center ">
          <Link to="/" className="w-40">
            Logo
          </Link>
          <SearchInput />
          <Button variant="ghost">
            <Bell className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" onClick={logout} disabled={isLoading}>
            Logout
          </Button>

          {isLoading ? (
            <Skeleton className="w-8 h-8 rounded-full" />
          ) : (
            <Button asChild variant="ghost" className="w-8 h-8 p-0 rounded-full">
              <UserAvatar
                name={user?.username || "user"}
                imageUrl={user?.avatarUrl}
                
              />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
