import HeaderAvatar from "@/shared/components/HeaderAvatar";
import { ModeToggle } from "@/shared/components/ModeToggle";
import SearchInput from "@/shared/components/SearchInput";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/shared/store/authStore";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

const Header = () => {
  const { username, avatarUrl , logout} = useAuthStore(
    useShallow((state) => ({
        username: state.user?.username,
        avatarUrl: state.user?.avatarUrl,
        logout: state.logout,
    }))
  );

  console.log("Header render:");

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
            <Button variant="ghost" onClick={logout}>Logout</Button>
          <HeaderAvatar name={username || ""} imageId={avatarUrl} />
        </div>
      </div>
    </header>
  );
};

export default Header;
