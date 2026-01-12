import CreatePostDIalog from "../../features/post/create/ui/CreatePostDIalog";
import FeedsList from "../FeedsList";
import MediaBox from "../MediaBox/MediaBox";
import type {  UserProfile } from "@/entities/user/model/types";

interface ProfileColumnProps {
  user?: UserProfile | null;
}

const ProfileColumn = ({ user }: ProfileColumnProps) => {

  return (
    <div className="flex flex-col gap-2">
     {user?.id && <MediaBox id={user.id} />}
      <CreatePostDIalog className="mt-2" />
      <FeedsList wallId={user?.wallId} />
    </div>
  );
};

export default ProfileColumn;
