import type { Group } from "@/entities/group/model/types";
import FeedsList from "../FeedsList";
import CreatePostDIalog from "@/features/post/create/ui/CreatePostDIalog";

interface GroupPageContentProps {
  group?: Group;
}

const GroupPageContent = ({ group }: GroupPageContentProps) => {
  return (
    <>
      {group?.isMember && <CreatePostDIalog wallId={group?.wallId} />}
      <FeedsList wallId={group?.wallId} />
    </>
  );
};

export default GroupPageContent;
