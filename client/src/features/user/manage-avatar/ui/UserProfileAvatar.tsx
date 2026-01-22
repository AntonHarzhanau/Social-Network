import { useEffect, useState } from "react";
import { useUserAvatar } from "../model/useUserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar } from "@/shared/components/Avatar";
import { AvatarCropDialog } from "@/widgets/AvatarCropDialog";
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
import { fetchUserAvatars } from "@/entities/user/api/userApi";
import { useMediaViewerStore } from "@/features/media/viewer/useMediaViewerStore";
import type { MediaPreview } from "@/entities/media/model/types";

interface UserProfileAvatarProps {
  userId?: string;
  avatarUrl?: string | null;
  name?: string | null;
  isOwner?: boolean;
  isOnline?: boolean;
}

const UserProfileAvatar = ({
  userId,
  avatarUrl,
  name,
  isOwner,
  isOnline,
}: UserProfileAvatarProps) => {
  const [cropOpen, setCropOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [avatars, setAvatars] = useState<MediaPreview[]>([]);
  const openViewer = useMediaViewerStore((s) => s.openViewer);
  const { uploadNewAvatar, deleteAvatar } = useUserAvatar(userId);

  useEffect(() => {
    const loadAvatars = async () => {
      if (!userId) return;
      try {
        const fetchedAvatars = await fetchUserAvatars(userId);
        setAvatars(fetchedAvatars);
      } catch (error) {
        console.error("Error fetching user avatars:", error);
      }
    };

    loadAvatars();
  }, [userId, avatarUrl]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="border-none focus:outline-none focus:ring-0 ">
          <Avatar
            imageUrl={avatarUrl || undefined}
            name={name || ""}
            isOnline={isOnline || false}
            className="
              h-32 w-32 sm:h-36 sm:w-36
              rounded-full border-4 shadow-lg
              cursor-pointer
            "
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              if (!userId) return;
              openViewer({
                author: {
                  id: userId,
                  name: name || "",
                  avatarUrl: avatarUrl || undefined,
                  isOnline: isOnline || false,
                },
                medias: avatars ?? [],
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

      <AvatarCropDialog
        open={cropOpen}
        onOpenChange={setCropOpen}
        onSaved={async ({ original, preview }) => {
          await uploadNewAvatar(original, preview);
          setCropOpen(false);
        }}
      />

      {/* Подтверждение удаления */}
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
