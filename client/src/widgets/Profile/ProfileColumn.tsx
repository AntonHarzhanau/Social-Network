import { Skeleton } from "@/shared/components/ui/skeleton";
import CreatePostDIalog from "../../features/post/create/ui/CreatePostDIalog";
import FeedsList from "../FeedsList";
import MediaBox from "../MediaBox/MediaBox";
import type { UserProfileResponse } from "@/entities/user/model/types";

interface ProfileColumnProps {
  user?: UserProfileResponse;
  loading: boolean;
}

const ProfileColumn = ({ user, loading }: ProfileColumnProps) => {
  const userId = user?.public.id;
  const wallId = user?.privateSummary?.wallId;

  console.log("ProfileColumn render", { user, loading });
  return (
    <div className="flex flex-col gap-2">
      {userId ? <MediaBox id={userId} /> : <Skeleton className="h-48 w-full" />}
      {!loading && wallId ? (
        <div className="flex flex-col gap-2">
          <CreatePostDIalog wallId={wallId} />
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
