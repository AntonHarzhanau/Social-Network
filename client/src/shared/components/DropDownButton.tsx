import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Ellipsis } from "lucide-react";

const DropDownButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card p-2 rounded-2xl">
        <DropdownMenuItem className="hover:bg-muted-foreground text-destructive">Delete</DropdownMenuItem>
      
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownButton;
