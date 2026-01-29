import { useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import type { GroupMember } from "@/entities/group/model/types";
import { useGroupMembers } from "@/entities/group/model/useGroupMembers";
import { useGroupMemberMutations } from "../../model/useGroupMemberMutation";
import { RequestRow } from "../rows/RequestRow";
import { GroupMembersTabBase } from "./GroupMembersTabBase";

export function RequestsTab(props: { groupId: string }) {
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
    status: "pending",
    q,
    limit: 20,
    enabled: true,
  });

  const { setStatusMut, rejectRequestMut, isBusy } = useGroupMemberMutations(
    props.groupId,
  );

  return (
    <GroupMembersTabBase<GroupMember>
      searchId="search-requests"
      placeholder="Search request..."
      search={search}
      onSearchChange={setSearch}
      countLabel="Requests"
      count={totalCount}
      items={members}
      isLoading={isLoading}
      isError={isError}
      emptyText="No requests"
      enableInfinite={true}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      renderItem={(m) => (
        <RequestRow
          member={m}
          disabled={isBusy}
          onAccept={() =>
            setStatusMut.mutate({ memberId: m.id, newStatus: "accepted" })
          }
          onReject={() => rejectRequestMut.mutate(m.id)}
          onBan={() =>
            setStatusMut.mutate({ memberId: m.id, newStatus: "banned" })
          }
        />
      )}
    />
  );
}
