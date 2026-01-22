import { useMemo, useState } from "react";
import { Card, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import SearchInput from "@/shared/components/SearchInput";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";
import { useSendFriendRequestMutation } from "@/entities/friends/model/useFriendMutation";
import { sessionStore } from "@/entities/session/model/sessionStore";
import { useUserSearch } from "@/entities/user/model/useUserSearch";
import { FindFriendCard } from "./FindFriendCard";

interface FindFriendsProps {
  onBack?: () => void;
}

export default function FindFriends({ onBack }: FindFriendsProps) {
  const currentUserId = sessionStore((s) => s.user?.id);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const limit = 12;

  const query = useUserSearch(limit, debouncedSearch);

  const users = useMemo(
    () => query.data?.pages.flatMap((p) => p) ?? [],
    [query.data],
  );

  const sendMutation = useSendFriendRequestMutation(currentUserId);

  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleSend = (id: string) => {
    setPendingId(id);

    sendMutation.mutate(id, {
      onSettled: () => setPendingId(null),
    });
  };

  const sentinelRef = useInfiniteScrollSentinel({
    enabled: query.isSuccess && !query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  });

  return (
    <Card className="flex flex-col w-full gap-3 px-2 py-3">
      <div className="flex items-center gap-2">
        <CardTitle className="text-base font-semibold">Find Friends</CardTitle>
        {onBack && (
          <Button variant="outline" className="ml-auto" onClick={onBack}>
            Back
          </Button>
        )}
      </div>

      <SearchInput
        searchId="search-users"
        placeholder="Search users..."
        value={search}
        onChange={setSearch}
      />

      {query.isLoading && (
        <div className="p-4 text-sm text-muted-foreground">Searching...</div>
      )}

      {query.isError && (
        <div className="p-4 text-sm">
          <div className="text-destructive">Failed to search</div>
          <pre className="text-xs opacity-70">{String(query.error)}</pre>
          <Button
            onClick={() => query.refetch()}
            variant="outline"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {query.isSuccess &&
        debouncedSearch.trim().length > 0 &&
        users.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">
            No users found.
          </div>
        )}

      {users.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {users.map((u) => (
            <FindFriendCard
              key={u.id}
              user={u}
              disabled={pendingId === u.id}
              onSendRequest={handleSend}
            />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-10" />

      {query.isFetchingNextPage && (
        <div className="p-4 text-sm text-muted-foreground">Loading more...</div>
      )}
    </Card>
  );
}
