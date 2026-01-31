import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/components/Avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

import { useGroupAvatar } from "../model/useGroupAvatar";
import { ImageCropDialog } from "@/widgets/AvatarCrop/ImageCropDialog";

interface GroupProfileAvatarProps {
  groupId?: string | null;
  avatarUrl?: string | null;
  name?: string | null;
  isOwner: boolean;
  className?: string;
}

const GroupProfileAvatar = ({
  groupId,
  avatarUrl,
  name,
  isOwner,
  className,
}: GroupProfileAvatarProps) => {
  const [open, setOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { uploadNewAvatar, deleteAvatar } = useGroupAvatar(groupId);

  const handleOpenChange = (next: boolean) => {
    if (!isOwner) return;
    setOpen(next);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={handleOpenChange} modal={false}>
        <DropdownMenuTrigger asChild disabled={!isOwner}>
          <button
            type="button"
            aria-label="Group avatar menu"
            className={cn(
              "relative block rounded-full",
              "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32",
              className,
            )}
          >
            <Avatar
              imageUrl={avatarUrl}
              name={name || ""}
              className="h-full w-full rounded-full border-4 shadow-lg cursor-pointer"
            />
          </button>
        </DropdownMenuTrigger>

        {isOwner && (
          <DropdownMenuContent align="start" sideOffset={8}>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setOpen(false);
                setCropOpen(true);
              }}
            >
              Upload photo
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onSelect={(e) => {
                e.preventDefault();
                setOpen(false);
                setDeleteOpen(true);
              }}
            >
              Delete photo
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <ImageCropDialog
        open={cropOpen}
        onOpenChange={setCropOpen}
        onSaved={async ({ original, preview }) => {
          await uploadNewAvatar(original, preview);
          setCropOpen(false);
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete avatar?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteAvatar();
                setDeleteOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GroupProfileAvatar;
