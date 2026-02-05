import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  onEditCover: () => void;
  onEditProfile: () => void;
};

export function UserProfileCoverActions({
  open,
  onOpenChange,
  onEditCover,
  onEditProfile,
}: Props) {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="secondary" className="h-9 w-9">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onOpenChange(false);
                onEditCover();
              }}
            >
              Edit cover
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onOpenChange(false);
                onEditProfile();
              }}
            >
              Edit profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <Button variant="secondary" size="sm" onClick={onEditCover}>
          Edit cover
        </Button>
      </div>
    </>
  );
}
