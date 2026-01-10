import { Outlet } from "react-router";
import Header from "./Header";
import Menu from "./Menu";
import { sessionUser } from "@/entities/session/model/sessionStore";
import GlobalMediaViewer from "../media-modal/GlobalMediaViewer";

const Layout = () => {
  const user = sessionUser();
  return (
    <div className="flex flex-col overflow-visible">
      <GlobalMediaViewer />
      <Header user={user} />
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
