import { useEffect, useState } from "react";
import { useUserAvatar } from "../model/useUserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { UserAvatar } from "@/shared/components/UserAvatar";
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
import { MediaAssetModal } from "@/shared/components/MediaAssetModal";
import { fetchUserAvatars } from "@/entities/user/api/userApi";
import type { MediaResponse } from "@/entities/media/model/mediaResponseTypes";

interface UserProfileAvatarProps {
  userId?: string;
  avatarUrl?: string | null;
  username?: string | null;
  isOwner?: boolean;
}

const UserProfileAvatar = ({
  userId,
  avatarUrl,
  username,
  isOwner,
}: UserProfileAvatarProps) => {
  const [cropOpen, setCropOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
    const [avatars, setAvatars] = useState<MediaResponse[]>([]);
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
          <UserAvatar
            imageUrl={avatarUrl || undefined}
            name={username || ""}
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
              setGalleryOpen(true);
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

      {userId && (
        <MediaAssetModal
          open={galleryOpen}
          onOpenChange={setGalleryOpen}
          author={{
            id: userId,
            username: username || "",
            avatarUrl: avatarUrl || undefined,
          }}
          medias={avatars}
          initialIndex={0}
        />
      )}

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
