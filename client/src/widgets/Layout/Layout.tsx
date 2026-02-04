import { Outlet } from "react-router";
import Header from "./Header";
import Menu from "./Menu";
import { sessionStore } from "@/entities/session/model/sessionStore";
import GlobalMediaViewer from "../media-modal/GlobalMediaViewer";
import MobileBottomNav from "./MobileBottomNav";

const Layout = () => {
  const user = sessionStore((s) => s.user);

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalMediaViewer />

      <Header user={user} />

      <div className="mx-auto w-full max-w-[1200px] flex-1 px-2 sm:px-4 md:px-6">
        <div className="flex gap-2">
          <aside className="hidden md:block md:w-56 lg:w-64 shrink-0">
            <Menu user={user} />
          </aside>

          <main className="flex-1 min-w-0 py-2 pb-16 md:pb-2">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileBottomNav user={user} />
    </div>
  );
};

export default Layout;
