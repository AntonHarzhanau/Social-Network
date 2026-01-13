import { Skeleton } from "@/shared/components/ui/skeleton";
import CreatePostDIalog from "../../features/post/create/ui/CreatePostDIalog";
import FeedsList from "../FeedsList";
import MediaBox from "../MediaBox/MediaBox";
import type { UserProfile } from "@/entities/user/model/types";

interface ProfileColumnProps {
  user?: UserProfile;
  loading: boolean;
}

const ProfileColumn = ({ user, loading }: ProfileColumnProps) => {
  const wallId = user?.wallId;

  return (
    <div className="flex flex-col gap-2">
      {user?.id ? (
        <MediaBox id={user.id} />
      ) : (
        <Skeleton className="h-48 w-full" />
      )}
      {!loading && user?.wallId ? (
        <div className="flex flex-col gap-2">
          <CreatePostDIalog wallId={user?.wallId} />
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
