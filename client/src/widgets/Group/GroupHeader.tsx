import ProfileHeader from "@/shared/components/ProfileHeader";
import { Skeleton } from "@/shared/components/ui/skeleton";
import GroupProfileAvatar from "@/features/group/manage-avatar/ui/GroupProfileAvatar";
import { GroupMembershipActions } from "@/features/group/membership-actions/ui/GroupMembershipActions";
import type { Group } from "@/entities/group/model/types";
import {
  useJoinGroupMutation,
  useLeaveGroupMutation,
} from "@/entities/group/model/useGroupMutations";
import { useState } from "react";
import { GroupSettingsDialog } from "./GroupSettingsDialog";

interface GroupHeaderProps {
  group?: Group;
  loading: boolean;
}

const GroupHeader = ({ group, loading }: GroupHeaderProps) => {
  const joinMut = useJoinGroupMutation();
  const leaveMut = useLeaveGroupMutation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  console.log("GroupHeader render", group);
  if (!group && !loading) return null;

  const isOwner = !!group?.isMember && group?.role === "owner";
  const isPending = group?.status === "pending";

  const actions = group ? (
    isPending ? (
      <span className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full whitespace-nowrap">
        You sent request
      </span>
    ) : (
      <GroupMembershipActions
        isMember={!!group.isMember}
        groupVisibility={group.visibility}
        role={group.role as any}
        loading={joinMut.isPending || leaveMut.isPending}
        onJoin={() =>
          joinMut.mutateAsync({
            groupId: group.id,
            visibility: group.visibility,
          })
        }
        onRequestJoin={() =>
          joinMut.mutateAsync({
            groupId: group.id,
            visibility: group.visibility,
          })
        }
        onLeave={() => leaveMut.mutateAsync(group.id)}
        onOpenSettings={() => setSettingsOpen(true)}
        size="sm"
      />
    )
  ) : null;

  return (
    <>
      <ProfileHeader
        cover={
          group?.cover?.url ? (
            <img
              src={group.cover.url}
              alt="Group cover"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : undefined
        }
        coverAction={null}
        avatar={
          <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
            <GroupProfileAvatar
              groupId={group?.id}
              avatarUrl={group?.currentAvatar?.url}
              name={group?.name}
              isOwner={isOwner}
            />
          </div>
        }
        title={
          loading ? (
            <Skeleton className="h-8 w-48 sm:w-64 md:w-80 lg:w-96 rounded-md" />
          ) : (
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
              {group?.name}
            </h1>
          )
        }
        rightActions={
          actions ? (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          ) : null
        }
        meta={
          loading ? null : (
            <div className="text-sm text-muted-foreground">
              {group?.isMember
                ? "Member"
                : `${group?.subscribersCount ?? 0} subscribers`}
            </div>
          )
        }
      />
      <GroupSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        group={group}
      />
    </>
  );
};

export default GroupHeader;
