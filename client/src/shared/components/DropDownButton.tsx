import { Ellipsis } from "lucide-react";
import { cn } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface DropDownButtonProps {
  className?: string;
}

const DropDownButton = ({ className }: DropDownButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("", className)}>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card p-2 rounded-2xl">
        <DropdownMenuItem className="hover:bg-muted-foreground text-destructive">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownButton;
