import SearchInput from "@/shared/components/SearchInput";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import FriendListItem from "../../entities/friends/ui/FriendListItem";
import { useFriendsFilterStore } from "../../entities/friends/model/useFriendsFilterStore";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";
import { useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useFriends } from "@/entities/friends/model/useFriends";

interface FriendsListProps {
  userId: string | undefined;
  onFindFriends?: () => void;
}

const FriendsList = ({ userId, onFindFriends }: FriendsListProps) => {
  const filter = useFriendsFilterStore((state) => state.filter);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);

  const {
    data: users,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

    refetch,
  } = useFriends(filter, userId, 10, debouncedSearch);

  const sentinelRef = useInfiniteScrollSentinel({
    enabled: !isLoading && !isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <Card className="flex flex-col w-full gap-2 px-2">
      <div className="flex gap-2">
        <Button variant="outline">
          <div className="flex gap-2">
            <h3>All</h3>
            <p className="text-sm text-muted-foreground">
              {/* можно total с сервера */}
            </p>
          </div>
        </Button>

        <Button variant="outline">
          <div className="flex gap-2">
            <h3>Online</h3>
            <p className="text-sm text-muted-foreground">
              {/* online count */}
            </p>
          </div>
        </Button>

        <Button className="ml-auto" onClick={onFindFriends}>
          Find Friends
        </Button>
      </div>

      <SearchInput
        searchId="search-friends"
        placeholder="Search friends..."
        value={search}
        onChange={setSearch}
      />

      {isLoading && (
        <div className="p-4 text-sm text-muted-foreground">Loading...</div>
      )}

      {isError && (
        <div className="p-4 text-sm">
          <div className="text-destructive">Failed to load</div>
          <pre className="text-xs opacity-70">{String(error)}</pre>
          <Button onClick={() => refetch()} variant="outline" className="mt-2">
            Retry
          </Button>
        </div>
      )}

      {!isLoading &&
        !isError &&
        users.map((user) => (
          <FriendListItem key={user.id} user={user} filter={filter} />
        ))}

      <div ref={sentinelRef} className="h-10" />

      {isFetchingNextPage && (
        <div className="p-4 text-sm text-muted-foreground">Loading more...</div>
      )}
    </Card>
  );
};

export default FriendsList;
