import { Button } from "@/shared/components/ui/button";
import { MAIN_MENU } from "@/shared/constants/menu";
import { cn } from "@/shared/lib/utils";
import { Link } from "react-router-dom";


interface MenuProps {
  className?: string;
}
const Menu = ({ className }: MenuProps) => {
  return (
    <nav className={cn("sticky top-14 ", className)}>
      {MAIN_MENU.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            to={item.path}
            key={item.path}
            className="flex items-center"
          >
            <Button variant="ghost" className="w-full justify-start py-2 hover:bg-accent-foreground/5">
              <Icon className="w-5 h-5" />
              <span className="font-normal">{item.name}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

export default Menu;
