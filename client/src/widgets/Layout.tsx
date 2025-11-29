import { Outlet } from "react-router";
import Header from "./Header";
import Menu from "./Menu";

const Layout = () => {
  return (
    <div>
      <Header />
      <div className="flex max-w-6xl w-full  mx-auto gap-2">
        <div>
          <Menu />
        </div>
        <main className="flex-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
