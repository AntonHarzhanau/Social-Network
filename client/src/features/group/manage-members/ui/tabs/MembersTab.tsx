import { useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import type { GroupMember, MemberRole } from "@/entities/group/model/types";
import { useGroupMembers } from "@/entities/group/model/useGroupMembers";
import { useMemberPermissions } from "../../model/permissions";
import { useGroupMemberMutations } from "../../model/useGroupMemberMutation";
import { MemberRow } from "../rows/MemberRow";
import { GroupMembersTabBase } from "./GroupMembersTabBase";

export function MembersTab(props: {
  groupId: string;
  myRole: MemberRole;
  myUserId: string;
}) {
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search, 400);

  const {
    members,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGroupMembers({
    groupId: props.groupId,
    status: "accepted",
    q,
    limit: 20,
    enabled: true,
  });

  const { canChangeRole, canBan } = useMemberPermissions(
    props.myRole,
    props.myUserId,
  );

  const { changeRoleMut, setStatusMut, isBusy } = useGroupMemberMutations(
    props.groupId,
  );

  return (
    <GroupMembersTabBase<GroupMember>
      searchId="search-members"
      placeholder="Search member..."
      search={search}
      onSearchChange={setSearch}
      countLabel="Subscribers"
      count={totalCount}
      items={members}
      isLoading={isLoading}
      isError={isError}
      emptyText="No members"
      enableInfinite={true}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      renderItem={(m) => (
        <MemberRow
          member={m}
          disabled={isBusy}
          canChangeRole={canChangeRole(m)}
          canBan={canBan(m)}
          onChangeRole={(nextRole) =>
            changeRoleMut.mutate({ memberId: m.id, newRole: nextRole })
          }
          onBan={() =>
            setStatusMut.mutate({ memberId: m.id, newStatus: "banned" })
          }
        />
      )}
    />
  );
}
