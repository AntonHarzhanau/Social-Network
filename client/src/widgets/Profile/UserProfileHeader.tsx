import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import ProfileHeader from "@/shared/components/ProfileHeader";
import UserProfileAvatar from "@/features/user/manage-avatar/ui/UserProfileAvatar";
import type { UserProfileResponse } from "@/entities/user/model/types";
import { sessionStore } from "@/entities/session/model/sessionStore";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { useUserProfileDetails } from "@/entities/user/model/useUserProfileDetails";
import { useUserCover } from "@/features/user/manage-avatar/model/useUserCover";
import { ImageCropDialog } from "../AvatarCrop/ImageCropDialog";
import { EditProfileDialog } from "./edit-profile-dialog/EditProfilleDialog";
import NewMessageDialog from "../NewMessageDialog";

import { UserProfileCoverActions } from "./user-profile-header/UserProfileCoverActions";
import { UserProfileMeta } from "./user-profile-header/UserProfileMeta";
import { ProfileDetailsDialog } from "./user-profile-header/ProfileDetailsDialog";

interface UserProfileHeaderProps {
  user?: UserProfileResponse;
  loading: boolean;
}

const UserProfileHeader = ({ user, loading }: UserProfileHeaderProps) => {
  const currentUser = sessionStore((s) => s.user);

  const publicP = user?.public;
  const summary = user?.privateSummary;

  const isOwner = !!publicP?.id && publicP.id === currentUser?.id;

  const updateCoverMutation = useUserCover(currentUser?.id ?? "");

  const [coverCropOpen, setCoverCropOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  const [moreOpen, setMoreOpen] = useState(false);
  const detailsQuery = useUserProfileDetails(
    publicP?.id,
    moreOpen && !!user?.canViewMore,
  );

  const coverImageUrl = publicP?.coverUrl ?? null;

  const educationLabel =
    summary?.currentEducation?.institutionName ??
    summary?.currentEducation?.programName ??
    null;

  const workLabel =
    summary?.currentWorkExperience?.company ??
    summary?.currentWorkExperience?.positionTitle ??
    null;

  const openEditCover = () => setCoverCropOpen(true);

  const openEditProfile = () => {
    setActionsOpen(false);
    setEditOpen(true);
  };

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
            <UserProfileCoverActions
              open={actionsOpen}
              onOpenChange={setActionsOpen}
              onEditCover={openEditCover}
              onEditProfile={openEditProfile}
            />
          ) : null
        }
        avatar={
          <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
            <UserProfileAvatar
              userId={publicP?.id}
              avatarUrl={publicP?.avatarUrl}
              name={publicP?.name}
              isOwner={isOwner}
              isOnline={publicP?.isOnline}
            />
          </div>
        }
        title={
          loading ? (
            <Skeleton className="h-8 w-48 sm:w-64 md:w-80 lg:w-96 rounded-md" />
          ) : (
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
              {publicP?.name}
            </h1>
          )
        }
        rightActions={
          isOwner ? (
            <div className="hidden md:block">
              <Button onClick={openEditProfile}>Edit profile</Button>
            </div>
          ) : (
            <div>
              {publicP?.id ? (
                <NewMessageDialog
                  userId={publicP.id}
                  username={publicP.name || "User"}
                  avatarUrl={publicP.avatarUrl}
                  type="default"
                />
              ) : null}
            </div>
          )
        }
        meta={
          <UserProfileMeta
            userId={publicP?.id}
            location={summary?.location ?? null}
            educationLabel={educationLabel}
            workLabel={workLabel}
            canViewMore={!!user?.canViewMore}
            onMore={() => setMoreOpen(true)}
          />
        }
      />

      <ProfileDetailsDialog
        open={moreOpen}
        onOpenChange={setMoreOpen}
        isPending={detailsQuery.isPending}
        data={detailsQuery.data as any}
      />

      <ImageCropDialog
        variant="cover"
        open={coverCropOpen}
        onOpenChange={setCoverCropOpen}
        onSaved={({ preview }) => updateCoverMutation.uploadNewCover(preview)}
      />

      {isOwner && currentUser?.id ? (
        <EditProfileDialog
          myUserId={currentUser.id}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
    </>
  );
};

export default UserProfileHeader;
