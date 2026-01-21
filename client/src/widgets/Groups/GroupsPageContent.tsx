import { useGroups } from "@/entities/group/model/useGroups";
import SearchInput from "@/shared/components/SearchInput";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Item } from "@/shared/components/ui/item";
import { Avatar } from "@/shared/components/Avatar";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useState } from "react";
import { Link } from "react-router-dom";

const GroupsPageContent = ({ myGroupsOnly }: { myGroupsOnly: boolean }) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);

  const { groups } = useGroups({
    forMe: myGroupsOnly,
    groupName: debouncedSearch,
  });

  return (
    <Card className="flex flex-col min-h-[90vh] px-2">
      <SearchInput
        searchId="search-groups"
        placeholder="Search groups..."
        value={search}
        onChange={setSearch}
      />
      <div className=" flex flex-col gap-2">
        {groups.map((group) => (
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
              <div className="flex items-center gap-3">
                {group.isMember ? (
                  <Button variant="outline" size="sm">
                    Leave
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    Join
                  </Button>
                )}
              </div>
            </Item>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default GroupsPageContent;
