import { useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import type { GroupMember } from "@/entities/group/model/types";
import { useGroupMembers } from "@/entities/group/model/useGroupMembers";
import { useGroupMemberMutations } from "../../model/useGroupMemberMutation";
import { BannedRow } from "../rows/BannedRow";
import { GroupMembersTabBase } from "./GroupMembersTabBase";

export function BlacklistTab(props: { groupId: string }) {
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
    status: "banned",
    q,
    limit: 20,
    enabled: true,
  });

  const { unbanMut, isBusy } = useGroupMemberMutations(props.groupId);

  return (
    <GroupMembersTabBase<GroupMember>
      searchId="search-blacklist"
      placeholder="Search banned..."
      search={search}
      onSearchChange={setSearch}
      countLabel="Banned"
      count={totalCount}
      items={members}
      isLoading={isLoading}
      isError={isError}
      emptyText="Blacklist is empty"
      enableInfinite={true}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      renderItem={(m) => (
        <BannedRow
          member={m}
          disabled={isBusy}
          onUnban={() => unbanMut.mutate({ memberId: m.id })}
        />
      )}
    />
  );
}
