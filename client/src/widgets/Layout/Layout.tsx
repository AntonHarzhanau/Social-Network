// import { Outlet } from "react-router";
// import Header from "./Header";
// import Menu from "./Menu";
// import { sessionUser } from "@/entities/session/model/sessionStore";
// import GlobalMediaViewer from "../media-modal/GlobalMediaViewer";

// const Layout = () => {
//   const user = sessionUser();
//   return (
//     <div className="flex flex-col overflow-visible">
//       <GlobalMediaViewer />
//       <Header user={user} />
//       <div className="flex max-w-[1100px] w-full h-full mx-auto gap-2">
//         <div className="flex-1">
//           <Menu user={user} />
//         </div>
//         <main className="flex-6 py-2 px-4 h-full min-w-0">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import { Outlet } from "react-router";
import Header from "./Header";
import Menu from "./Menu";
import { sessionUser } from "@/entities/session/model/sessionStore";
import GlobalMediaViewer from "../media-modal/GlobalMediaViewer";
import MobileBottomNav from "./MobileBottomNav";

const Layout = () => {
  const user = sessionUser();

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalMediaViewer />

      <Header user={user} />

      {/* Контентная область */}
      <div className="mx-auto w-full max-w-[1100px] flex-1 px-2 sm:px-4 md:px-6">
        <div className="flex gap-2">
          {/* Левое меню: только md+ */}
          <aside className="hidden md:block md:w-56 lg:w-64 shrink-0">
            <Menu user={user} />
          </aside>

          {/* main: на mobile добавляем нижний padding, чтобы не перекрывал bottom-nav */}
          <main className="flex-1 min-w-0 py-2 pb-16 md:pb-2">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Bottom menu: только mobile */}
      <MobileBottomNav user={user} />
    </div>
  );
};

export default Layout;
