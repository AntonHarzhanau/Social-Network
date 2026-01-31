import type { Group } from "@/entities/group/model/types";
import FeedsList from "../FeedsList";
import CreatePostDIalog from "@/features/post/create/ui/CreatePostDIalog";

interface GroupPageContentProps {
  group?: Group;
}

const GroupPageContent = ({ group }: GroupPageContentProps) => {
  return (
    <div className="flex flex-col gap-2">
      {group?.isMember && group.wallId && (
        <CreatePostDIalog wallId={group?.wallId} />
      )}
      {group?.wallId && <FeedsList wallId={group?.wallId} />}
    </div>
  );
};

export default GroupPageContent;
