import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

import type { ChatMemberRole } from "@/entities/chat/model/types";
import { roleLabel } from "@/entities/chat/lib/role";

export function RoleCell(props: {
  role: ChatMemberRole;
  canChange: boolean;
  onPick: (next: "admin" | "member") => void;
}) {
  if (props.role === "owner" || !props.canChange) {
    return <p className="text-sm text-gray-500">{props.role}</p>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-gray-500 hover:text-gray-900"
        >
          {roleLabel(props.role)}
          <ChevronDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => props.onPick("member")}>
          Member
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => props.onPick("admin")}>
          Admin
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
