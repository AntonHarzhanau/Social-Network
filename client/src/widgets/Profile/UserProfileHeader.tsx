import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import EditProfileForm from "@/entities/user/ui/EditProfileForm";
import ProfileHeader from "@/shared/components/ProfileHeader";
import UserProfileAvatar from "@/features/user/manage-avatar/ui/UserProfileAvatar";
import { Link } from "react-router-dom";
import { GraduationCap, Info, MapPin, MoreHorizontal } from "lucide-react";
import { sessionStore } from "@/entities/session/model/sessionStore";
import type { UserProfile } from "@/entities/user/model/types";
import { CoverCropDialog } from "@/widgets/CoverCropDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface UserProfileHeaderProps {
  user?: UserProfile;
  loading: boolean;
}

const UserProfileHeader = ({ user, loading }: UserProfileHeaderProps) => {
  const currentUser = sessionStore((s) => s.user);
  const isOwner = !!user?.id && user?.id === currentUser?.id;

  const [coverCropOpen, setCoverCropOpen] = useState(false);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const [actionsOpen, setActionsOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const openingDialogRef = useRef(false);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    };
  }, [coverPreviewUrl]);

  useEffect(() => {
    setCoverPreviewUrl((prev) => (prev ? null : prev));
  }, [user?.id]);

  const handleEditCover = () => setCoverCropOpen(true);

  const openEditProfile = () => {
    openingDialogRef.current = true;
    setActionsOpen(false);
    setEditProfileOpen(true);
  };

  const coverImageUrl = coverPreviewUrl ?? user?.coverUrl ?? null;

  return (
    <>
      <ProfileHeader
        cover={
          coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt="Profile cover"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : undefined
        }
        coverAction={
          isOwner ? (
            <>
              {/* Mobile */}
              <div className="md:hidden">
                <DropdownMenu
                  open={actionsOpen}
                  onOpenChange={(v) => setActionsOpen(v)}
                  modal={false}
                >
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary" className="h-9 w-9">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="min-w-44"
                    onCloseAutoFocus={(e) => {
                      if (openingDialogRef.current) {
                        e.preventDefault();
                        openingDialogRef.current = false;
                      }
                    }}
                  >
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setActionsOpen(false);
                        setCoverCropOpen(true);
                      }}
                    >
                      Edit cover
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        openEditProfile();
                      }}
                    >
                      Edit profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <Button variant="secondary" size="sm" onClick={handleEditCover}>
                  Edit cover
                </Button>
              </div>
            </>
          ) : null
        }
        avatar={
          <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
            <UserProfileAvatar
              userId={user?.id}
              avatarUrl={user?.avatarUrl}
              name={user?.name}
              isOwner={isOwner}
              isOnline={user?.isOnline}
            />
          </div>
        }
        title={
          loading ? (
            <Skeleton className="h-8 w-48 sm:w-64 md:w-80 lg:w-96 rounded-md" />
          ) : (
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
              {user?.name}
            </h1>
          )
        }
        rightActions={
          isOwner ? (
            <div className="hidden md:block">
              <EditProfileForm profileData={user} userId={user?.id} />
            </div>
          ) : null
        }
        meta={
          <div className="text-muted-foreground">
            <div className="flex flex-wrap gap-x-4 items-center">
              {user?.location ? (
                <Link to="/profile" className="inline-flex">
                  <div className="flex gap-1 items-center hover:underline">
                    <MapPin className="text-foreground h-4 w-4" />
                    <p className="text-foreground">{user.location}</p>
                  </div>
                </Link>
              ) : null}

              <Link to="/profile" className="inline-flex">
                <div className="flex gap-1 items-center hover:underline">
                  <GraduationCap className="text-foreground h-4 w-4" />
                  <p className="text-foreground">Ynov Campus Strasbourg</p>
                </div>
              </Link>

              <div className="flex gap-1 items-center hover:underline cursor-pointer">
                <Info className="text-foreground h-4 w-4" />
                <p className="text-foreground">More</p>
              </div>
            </div>
          </div>
        }
      />

      <EditProfileForm
        profileData={user}
        userId={user?.id}
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        withTrigger={false}
      />

      <CoverCropDialog
        open={coverCropOpen}
        onOpenChange={setCoverCropOpen}
        onSaved={({ previewUrl }) => setCoverPreviewUrl(previewUrl)}
      />
    </>
  );
};

export default UserProfileHeader;
