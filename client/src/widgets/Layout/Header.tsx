// import { authActions } from "@/features/auth/model/authActions";
// import type { UserPreview } from "@/entities/user/model/types";
// import { ModeToggle } from "@/shared/components/ModeToggle";
// import { Button } from "@/shared/components/ui/button";
// import { Avatar } from "@/shared/components/Avatar";
// import { Bell } from "lucide-react";
// import { Link } from "react-router-dom";

// interface HeaderProps {
//   user?: UserPreview | null;
// }

// const Header = ({ user }: HeaderProps) => {
//   const { logout } = authActions;
//   return (
//     <header className="flex justify-center h-12 border border-b items-center bg-card px-4 sticky top-0 z-20">
//       <div className="flex items-center max-w-[1100px] w-full justify-between">
//         <Link to="/" className="w-40">
//           Logo
//         </Link>

//         <div className="flex items-center gap-5">
//           <Button variant="ghost">
//             <Bell className="w-6 h-6" />
//           </Button>
//           <ModeToggle />
//           <Button variant="ghost" onClick={logout}>
//             Logout
//           </Button>

//           <Button asChild variant="ghost" className="w-8 h-8 p-0 rounded-full">
//             <Avatar name={user?.name} imageUrl={user?.avatarUrl} />
//           </Button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

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
    <header className="sticky top-0 z-20 border-b bg-card">
      <div className="mx-auto max-w-[1100px] h-12 px-2 sm:px-4 md:px-6 flex items-center justify-between">
        {/* LEFT: desktop logo / mobile avatar */}
        <div className="flex items-center gap-2">
          <Link to="/" className="hidden md:block w-40">
            Logo
          </Link>

          <Button
            asChild
            variant="ghost"
            className="md:hidden w-9 h-9 p-0 rounded-full"
          >
            {/* На мобилке аватар можно вести на профиль */}
            <Link to={user?.id ? `/profile/${user.id}` : "/"}>
              <Avatar
                name={user?.name}
                imageUrl={user?.avatarUrl}
                className="w-8 h-8"
              />
            </Link>
          </Button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
          <Button variant="ghost" className="p-2">
            <Bell className="w-6 h-6" />
          </Button>

          {/* Тему можно оставить на мобилке или спрятать */}
          <ModeToggle />

          {/* Logout и аватар справа — только на md+ */}
          <Button
            variant="ghost"
            onClick={logout}
            className="hidden md:inline-flex"
          >
            Logout
          </Button>

          <Button
            asChild
            variant="ghost"
            className="hidden md:inline-flex w-8 h-8 p-0 rounded-full"
          >
            <Link to={user?.id ? `/profile/${user.id}` : "/"}>
              <Avatar
                name={user?.name}
                imageUrl={user?.avatarUrl}
                className="w-10 h-10"
              />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
