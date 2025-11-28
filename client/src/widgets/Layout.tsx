import { Outlet } from "react-router";
import Header from "./Header";
import Menu from "./Menu";

const Layout = () => {
  return (
    <div>
      <Header />
      <div className="flex max-w-6xl w-full h-screen  mx-auto gap-2">
        <div className="flex-1">
            <Menu className="flex-1 sticky top-12"/>
        </div>
        <main className="flex-5 bg-red-700">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
