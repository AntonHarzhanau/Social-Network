import { Outlet } from "react-router";
import Header from "./Header";
import Menu from "./Menu";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/shared/store/authStore";

const Layout = () => {
  const { user, isLoading, logout } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isLoading: state.isLoading,
      logout: state.logout,
    })),
  );
  return (
    <div className="flex flex-col overflow-visible">
      <Header user={user} isLoading={isLoading} logout={logout} />
      <div className="flex max-w-[1100px] w-full h-full mx-auto gap-2">
        <div className="flex-1">
          <Menu user={user} />
        </div>
        <main className="flex-6 py-2 px-4 h-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
