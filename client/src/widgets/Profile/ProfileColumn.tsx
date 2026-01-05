import CreatePostDIalog from "../../features/post/create/ui/CreatePostDIalog";
import FeedsList from "../FeedsList";
import MediaBox from "../MediaBox/MediaBox";

interface ProfileColumnProps {
  userId?: string;
}

const ProfileColumn = ({ userId }: ProfileColumnProps) => {

  return (
    <div className="flex flex-col gap-2">
     {userId && <MediaBox id={userId} />}

      <CreatePostDIalog className="mt-2" />
      <FeedsList authorId={userId} />
    </div>
  );
};

export default ProfileColumn;
