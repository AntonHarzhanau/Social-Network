import { useGroup } from "@/entities/group/model/useGroup";
import GroupProfileAvatar from "@/features/group/manage-avatar/ui/GroupProfileAvatar";
import { GroupMembershipActions } from "@/features/group/membership-actions/ui/GroupMembershipActions";
import CreatePostDIalog from "@/features/post/create/ui/CreatePostDIalog";
import ProfileHeader from "@/shared/components/ProfileHeader";
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
          <GroupProfileAvatar
            groupId={group?.id}
            avatarUrl={group?.currentAvatar?.url}
            name={group?.name}
            isOwner={group?.role === "owner"}
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
            <GroupMembershipActions
              isMember={!!group?.isMember}
              groupVisibility={
                (group?.groupVisibility ?? "public") as "public" | "private"
              }
              role={(group?.role ?? null) as any}
              onJoin={() => {
                /* join mutation */
              }}
              onRequestJoin={() => {
                /* request mutation */
              }}
              onLeave={() => {
                /* leave mutation */
              }}
              onOpenSettings={() => {
                /* open settings modal */
              }}
              loading={false}
            />
          </div>
        }
      />

      {group?.isMember && <CreatePostDIalog wallId={group?.wallId} />}
      <FeedsList wallId={group?.wallId} />
    </div>
  );
};

export default GroupPage;
export const Component = GroupPage;
