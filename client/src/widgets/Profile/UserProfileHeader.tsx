import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import ProfileHeader from "@/shared/components/ProfileHeader";
import UserProfileAvatar from "@/features/user/manage-avatar/ui/UserProfileAvatar";
import { Link } from "react-router-dom";
import { GraduationCap, Info, MapPin, MoreHorizontal } from "lucide-react";
import { sessionStore } from "@/entities/session/model/sessionStore";
import type { UserProfileResponse } from "@/entities/user/model/types";
import { CoverCropDialog } from "@/widgets/CoverCropDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Skeleton } from "@/shared/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { useUserProfileDetails } from "@/entities/user/model/useUserProfileDetails";
import { EditProfileDialog } from "./edit-profile-dialog/EditProfilleDialog";

interface UserProfileHeaderProps {
  user?: UserProfileResponse;
  loading: boolean;
}

const UserProfileHeader = ({ user, loading }: UserProfileHeaderProps) => {
  const currentUser = sessionStore((s) => s.user);

  const publicP = user?.public;
  const summary = user?.privateSummary;

  const isOwner = !!publicP?.id && publicP.id === currentUser?.id;

  const [coverCropOpen, setCoverCropOpen] = useState(false);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  const [moreOpen, setMoreOpen] = useState(false);
  const detailsQuery = useUserProfileDetails(
    publicP?.id,
    moreOpen && !!user?.canViewMore,
  );

  const openingDialogRef = useRef(false);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    };
  }, [coverPreviewUrl]);

  useEffect(() => {
    setCoverPreviewUrl((prev) => (prev ? null : prev));
  }, [publicP?.id]);

  useEffect(() => {
    if (editOpen) openingDialogRef.current = false;
  }, [editOpen]);

  const handleEditCover = () => setCoverCropOpen(true);

  const openEditProfile = () => {
    openingDialogRef.current = true;
    setActionsOpen(false);
    setEditOpen(true);
  };

  const coverImageUrl = coverPreviewUrl ?? publicP?.coverUrl ?? null;

  const educationLabel =
    summary?.currentEducation?.institutionName ??
    summary?.currentEducation?.programName ??
    null;

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
          ) : null
        }
        meta={
          <div className="text-muted-foreground">
            <div className="flex flex-wrap gap-x-4 items-center">
              {summary?.location ? (
                <Link to="/profile" className="inline-flex">
                  <div className="flex gap-1 items-center hover:underline">
                    <MapPin className="text-foreground h-4 w-4" />
                    <p className="text-foreground">{summary.location}</p>
                  </div>
                </Link>
              ) : null}

              {educationLabel ? (
                <div className="inline-flex">
                  <div className="flex gap-1 items-center">
                    <GraduationCap className="text-foreground h-4 w-4" />
                    <p className="text-foreground">{educationLabel}</p>
                  </div>
                </div>
              ) : null}

              {user?.canViewMore ? (
                <Button
                  variant="ghost"
                  type="button"
                  className="flex gap-1 items-center hover:underline cursor-pointer px-0!"
                  onClick={() => setMoreOpen(true)}
                >
                  <Info className="text-foreground h-4 w-4" />
                  <p className="text-foreground">More</p>
                </Button>
              ) : null}
            </div>
          </div>
        }
      />

      {/* More details dialog */}
      <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profile details</DialogTitle>
          </DialogHeader>

          {detailsQuery.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : detailsQuery.data ? (
            <div className="space-y-4">
              <div className="text-sm">
                <div>Date of birth: {detailsQuery.data.dateOfBirth}</div>
                <div>
                  Marital status: {detailsQuery.data.maritalStatus ?? "-"}
                </div>
                <div>Location: {detailsQuery.data.location ?? "-"}</div>
              </div>

              {detailsQuery.data.bio ? (
                <div className="text-sm whitespace-pre-wrap">
                  {detailsQuery.data.bio}
                </div>
              ) : null}

              <div className="text-sm">
                <div className="font-semibold mb-1">Work experience</div>
                <ul className="list-disc pl-5 space-y-1">
                  {detailsQuery.data.workExperiences.map((w) => (
                    <li key={w.id}>
                      {w.company}
                      {w.positionTitle ? ` — ${w.positionTitle}` : ""} (
                      {w.startAt} — {w.endAt ?? "present"})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-sm">
                <div className="font-semibold mb-1">Education</div>
                <ul className="list-disc pl-5 space-y-1">
                  {detailsQuery.data.educations.map((e) => (
                    <li key={e.id}>
                      {e.institutionName}
                      {e.programName ? ` — ${e.programName}` : ""} ({e.startAt}{" "}
                      — {e.endAt ?? "present"})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Details are not available.
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CoverCropDialog
        open={coverCropOpen}
        onOpenChange={setCoverCropOpen}
        onSaved={({ previewUrl }) => setCoverPreviewUrl(previewUrl)}
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
