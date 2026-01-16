import { useGroup } from "@/entities/group/model/useGroup";
import CreatePostDIalog from "@/features/post/create/ui/CreatePostDIalog";
import ProfileHeader from "@/shared/components/ProfileHeader";
import { Button } from "@/shared/components/ui/button";
import { UserAvatar } from "@/shared/components/UserAvatar";
import FeedsList from "@/widgets/FeedsList";
import { useParams } from "react-router-dom";

const GroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading, error } = useGroup(groupId!);

  return (
    <div>
      <ProfileHeader
        title={
          <h1 className="text-2xl font-bold text-secondary-foreground">
            {group?.name}
          </h1>
        }
        avatar={
          <UserAvatar
            imageUrl={group?.currentAvatar?.url}
            name={group?.name}
            className="
              h-32 w-32 sm:h-36 sm:w-36
              rounded-full border-4 shadow-lg
            "
          />
        }
        meta={
          <div className=" text-sm text-muted-foreground">
            {group?.isMember ? (
              "Member"
            ) : (
              <p>{group?.subscribersCount} subscribers</p>
            )}
          </div>
        }
        rightActions={
          <div className="flex items-center gap-3">
            {group?.isMember ? (
              <Button variant="outline" size="sm">
                Leave
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                Join
              </Button>
            )}
          </div>
        }
      />
      {group?.isMember && (
        <CreatePostDIalog wallId={group?.wallId} />
      )}
      <FeedsList wallId={group?.wallId} />
    </div>
  );
};

export default GroupPage;
export const Component = GroupPage;
