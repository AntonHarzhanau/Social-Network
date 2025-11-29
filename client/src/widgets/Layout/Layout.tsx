import { Outlet } from "react-router";
import Header from "./Header";
import Menu from "./Menu";

const Layout = () => {
  return (
    <div>
      <Header />
      <div className="flex max-w-[1100px] w-full  mx-auto gap-2">
        <div className="flex-1">
          <Menu />
        </div>
        <main className="flex-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
