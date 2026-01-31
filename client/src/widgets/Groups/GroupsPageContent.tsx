import { useGroups } from "@/entities/group/model/useGroups";
import SearchInput from "@/shared/components/SearchInput";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Item } from "@/shared/components/ui/item";
import { Avatar } from "@/shared/components/Avatar";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useJoinGroupMutation,
  useLeaveGroupMutation,
} from "@/entities/group/model/useGroupMutations";
import { useGroupFilterStore } from "@/features/group/filter-group/useGroupFilterStore";
import CreateGroupForm from "@/features/group/create-group/ui/CreateGroupForm";

const GroupsPageContent = () => {
  const [search, setSearch] = useState("");
  const filter = useGroupFilterStore((state) => state.filter);
  const debouncedSearch = useDebouncedValue(search, 500);

  const { groups } = useGroups({
    filter,
    groupName: debouncedSearch,
  });

  const joinMut = useJoinGroupMutation();
  const leaveMut = useLeaveGroupMutation();

  return (
    <Card className="flex flex-col min-h-[90vh] px-2">
      <CreateGroupForm className="ml-auto" />
      <SearchInput
        searchId="search-groups"
        placeholder="Search groups..."
        value={search}
        onChange={setSearch}
      />

      <div className="flex flex-col gap-2">
        {groups.map((group) => {
          const isJoining =
            joinMut.isPending && joinMut.variables?.groupId === group.id;
          const isLeaving =
            leaveMut.isPending && leaveMut.variables === group.id;

          const stopNav = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
          };

          const rightSide = (() => {
            if (group.role === "owner") {
              return (
                <span className="text-xs font-medium text-muted-foreground">
                  Your Group
                </span>
              );
            }

            if (group.isMember) {
              if (group.status === "pending") {
                return (
                  <span className="text-xs font-medium text-muted-foreground">
                    Request sent
                  </span>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Subscribed
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLeaving}
                    onClick={(e) => {
                      stopNav(e);
                      leaveMut.mutate(group.id);
                    }}
                  >
                    {isLeaving ? "Leaving..." : "Leave"}
                  </Button>
                </div>
              );
            }

            return (
              <Button
                variant="outline"
                size="sm"
                disabled={isJoining}
                onClick={(e) => {
                  stopNav(e);
                  joinMut.mutate({
                    groupId: group.id,
                    visibility: group.visibility,
                  });
                }}
              >
                {isJoining ? "Subscribing..." : "Subscribe"}
              </Button>
            );
          })();

          return (
            <Link key={group.id} to={`/group/${group.id}`}>
              <Item
                variant="outline"
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    name={group.name}
                    imageUrl={group.currentAvatar?.url}
                    className="w-10 h-10"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold">{group.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Subscribers: {group.subscribersCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">{rightSide}</div>
              </Item>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};

export default GroupsPageContent;
