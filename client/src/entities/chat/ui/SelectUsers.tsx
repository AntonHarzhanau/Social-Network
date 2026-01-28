import type { UserPreview } from "@/entities/user/model/types";
import { Avatar } from "@/shared/components/Avatar";
import SearchInput from "@/shared/components/SearchInput";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Item } from "@/shared/components/ui/item";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface SelectUsersProps {
  users: UserPreview[];
  search: string;
  setSearch: (value: string) => void;
  isError: boolean;
  error: Error | null;
  selectedIds: string[];
  toggle: (userId: string, nextChecked: boolean) => void;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

const SelectUsers = ({
  users,
  search,
  setSearch,
  isError,
  error,
  selectedIds,
  toggle,
  sentinelRef,
}: SelectUsersProps) => {
  return (
    <div>
      <SearchInput
        searchId="create-chat-search"
        placeholder="Friend name..."
        value={search}
        onChange={setSearch}
      />

      {isError && <div>Error: {error?.message}</div>}

      <ScrollArea className="max-h-96">
        {users.map((friend) => {
          const checked = selectedIds.includes(friend.id);

          return (
            <Item key={friend.id} className="justify-between">
              <div className="flex items-center space-x-2">
                <Avatar
                  imageUrl={friend.avatarUrl}
                  name={friend.name}
                  className="h-8 w-8"
                />
                <p>{friend.name}</p>
              </div>

              <Checkbox
                checked={checked}
                onCheckedChange={(v) => toggle(friend.id, v === true)}
              />
            </Item>
          );
        })}
        <div ref={sentinelRef} />
      </ScrollArea>
    </div>
  );
};

export default SelectUsers;
