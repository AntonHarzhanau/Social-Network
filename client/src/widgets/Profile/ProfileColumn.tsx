import { Skeleton } from "@/shared/components/ui/skeleton";
import CreatePostDIalog from "../../features/post/create/ui/CreatePostDIalog";
import FeedsList from "../FeedsList";
import MediaBox from "../MediaBox/MediaBox";

import type {
  UserProfileResponse,
  UserPreview,
} from "@/entities/user/model/types";
import { sessionStore } from "@/entities/session/model/sessionStore";
import { fetchUserMedias, attachMyMedia } from "@/entities/user/api/userApi";
import { invalidateUserProfile } from "@/entities/user/model/invalidateUserProfile";
import { useMediaViewerStore } from "@/features/media/viewer/useMediaViewerStore";
import type { MediaBoxSource } from "@/widgets/MediaBox/model/types";

interface ProfileColumnProps {
  user?: UserProfileResponse;
  loading: boolean;
}

const toUserPreview = (u: UserProfileResponse["public"]): UserPreview => ({
  id: u.id,
  name: u.name,
  avatarUrl: u.avatarUrl ?? null,
  slug: u.slug ?? null,
  wallId: null,
  lastLoginAt: null,
  isOnline: u.isOnline,
});

const ProfileColumn = ({ user, loading }: ProfileColumnProps) => {
  const currentUser = sessionStore((state) => state.user);
  const openViewer = useMediaViewerStore((s) => s.openViewer);

  const profileUserId = user?.public.id;
  const wallId = user?.privateSummary?.wallId;

  const isOwner = !!currentUser && currentUser.id === profileUserId;

  if (!profileUserId) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const canViewMedia = isOwner ? true : !!user?.canViewMore;

  const source: MediaBoxSource = {
    owner: { kind: "user", id: profileUserId },
    canView: canViewMedia,
    canUpload: isOwner,

    fetchMedias: (type, signal) => fetchUserMedias(profileUserId, type, signal),

    attachMedias: isOwner ? (ids) => attachMyMedia(ids) : undefined,

    afterAttachInvalidate: (qc) => invalidateUserProfile(qc, profileUserId),

    onShowAll: (type) => {
      // TODO: навигация на страницу всех медиа
      console.log("show all", type);
    },

    onOpenViewer: ({ medias, initialIndex }) => {
      openViewer({
        author: toUserPreview(user!.public),
        medias,
        initialIndex,
      });
    },
  };

  return (
    <div className="flex flex-col gap-2">
      <MediaBox source={source} />

      {!loading && wallId ? (
        <div className="flex flex-col gap-2">
          {isOwner && <CreatePostDIalog wallId={wallId} />}
          <FeedsList wallId={wallId} />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      )}
    </div>
  );
};

export default ProfileColumn;
