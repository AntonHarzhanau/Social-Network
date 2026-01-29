import { joinGroup, leaveGroup } from "@/entities/group/api/groupApi";
import type { Group } from "@/entities/group/model/types";
import GroupProfileAvatar from "@/features/group/manage-avatar/ui/GroupProfileAvatar";
import { GroupMembershipActions } from "@/features/group/membership-actions/ui/GroupMembershipActions";
import ProfileHeader from "@/shared/components/ProfileHeader";

interface GroupHeaderProps {
  group?: Group;
}

const GroupHeader = ({ group }: GroupHeaderProps) => {
  if (!group) return null;
  return (
    <ProfileHeader
      cover={
        group?.cover ? (
          <img
            src={group?.cover.url}
            alt="Profile cover"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : undefined
      }
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
          {group?.status === "pending" ? (
            <span className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
              You sent request
            </span>
          ) : (
            <GroupMembershipActions
              isMember={!!group?.isMember}
              groupVisibility={
                (group?.visibility ?? "public") as "public" | "private"
              }
              role={(group?.role ?? null) as any}
              onJoin={async () => {
                await joinGroup(group.id);
              }}
              onRequestJoin={async () => {
                await joinGroup(group.id);
              }}
              onLeave={async () => {
                await leaveGroup(group.id);
              }}
              onOpenSettings={() => {
                /* open settings modal */
              }}
              loading={false}
            />
          )}
        </div>
      }
    />
  );
};

export default GroupHeader;
