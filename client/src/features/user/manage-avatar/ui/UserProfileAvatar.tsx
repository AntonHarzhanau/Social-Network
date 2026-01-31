import { useState } from "react";
import { useUserAvatar } from "../model/useUserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar } from "@/shared/components/Avatar";
import { ImageCropDialog } from "@/widgets/AvatarCrop/ImageCropDialog";
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
import { useMediaViewerStore } from "@/features/media/viewer/useMediaViewerStore";
import { cn } from "@/shared/lib/utils";
import { useUserAvatars } from "@/entities/user/model/useUserQueries";

interface UserProfileAvatarProps {
  userId?: string;
  avatarUrl?: string | null;
  name?: string | null;
  isOwner?: boolean;
  isOnline?: boolean;
  className?: string;
}

const UserProfileAvatar = ({
  userId,
  avatarUrl,
  name,
  isOwner,
  isOnline,
  className,
}: UserProfileAvatarProps) => {
  const [cropOpen, setCropOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openViewer = useMediaViewerStore((s) => s.openViewer);

  const avatarsQuery = useUserAvatars({
    userId: userId ?? "",
    enabled: !!userId,
  });

  const { uploadNewAvatar, deleteAvatar } = useUserAvatar(userId);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "block h-full w-full border-none p-0 focus:outline-none focus:ring-0",
              className,
            )}
          >
            <Avatar
              imageUrl={avatarUrl || undefined}
              name={name || ""}
              isOnline={isOnline || false}
              className="h-full w-full rounded-full border-4 shadow-lg cursor-pointer"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={async (e) => {
              e.preventDefault();
              if (!userId) return;

              const data =
                avatarsQuery.data ?? (await avatarsQuery.refetch()).data ?? [];

              openViewer({
                author: {
                  id: userId,
                  name: name || "",
                  avatarUrl: avatarUrl || undefined,
                  isOnline: isOnline || false,
                },
                medias: data,
                initialIndex: 0,
              });
            }}
          >
            Open photo
          </DropdownMenuItem>

          {isOwner && (
            <>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setCropOpen(true);
                }}
              >
                Upload photo
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  setDeleteOpen(true);
                }}
              >
                Delete photo
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
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

export default UserProfileAvatar;
