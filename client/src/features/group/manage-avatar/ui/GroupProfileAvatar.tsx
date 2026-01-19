import { setGroupAvatar } from "@/entities/group/api/groupApi";
import { uploadMedia } from "@/entities/media/api/mediaApi";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { AvatarCropDialog } from "@/widgets/AvatarCropDialog";
import { useState } from "react";

interface GroupProfileAvatarProps {
  groupId?: string | null;
  avatarUrl?: string | null;
  name?: string | null;
  isOwner: boolean;
}

const GroupProfileAvatar = ({
  groupId,
  avatarUrl,
  name,
  isOwner,
}: GroupProfileAvatarProps) => {
  const [open, setOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const uploadNewAvatar = async (data: { original: File; preview: File }) => {
    if (!groupId) return;

    const previewRes = await uploadMedia(data.preview);

    await setGroupAvatar(groupId, previewRes.id);
    return previewRes;
  };

  const deleteAvatar = async () => {
    if (!groupId) return;

    await setGroupAvatar(groupId, null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!isOwner) return;
    setOpen(next);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild disabled={!isOwner}>
          <button
            type="button"
            className="rounded-full"
            aria-label="Group avatar menu"
          >
            <UserAvatar
              imageUrl={avatarUrl}
              name={name || ""}
              className="
                h-32 w-32 sm:h-36 sm:w-36
                rounded-full border-4 shadow-lg
                cursor-pointer
              "
            />
          </button>
        </DropdownMenuTrigger>

        {isOwner && (
          <DropdownMenuContent align="start" sideOffset={8}>
            <DropdownMenuItem
              onSelect={() => {
                setOpen(false);
                setCropOpen(true);
              }}
            >
              Upload photo
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => {
                setOpen(false);
                setDeleteOpen(true);
              }}
            >
              Delete photo
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <AvatarCropDialog
        open={cropOpen}
        onOpenChange={setCropOpen}
        onSaved={async ({ original, preview }) => {
          await uploadNewAvatar({ original, preview });
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
