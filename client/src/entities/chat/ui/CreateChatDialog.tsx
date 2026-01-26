import { useFriends } from "@/entities/friends/model/useFriends";
import { sessionStore } from "@/entities/session/model/sessionStore";
import { Avatar } from "@/shared/components/Avatar";
import SearchInput from "@/shared/components/SearchInput";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Item } from "@/shared/components/ui/item";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useCreateChatMutation } from "@/entities/chat/model/useCreateChatMutation";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

const CreateChatDialog = () => {
  const user = sessionStore((state) => state.user);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);

  const [title, setTitle] = useState("New chat");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    data: friends,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useFriends("all", user?.id, 10, debouncedSearch);

  const sentinelRef = useInfiniteScrollSentinel({
    enabled: !isLoading && !isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const createChatMutation = useCreateChatMutation();

  const selectedCount = selectedIds.length;

  const toggleFriend = (friendId: string, nextChecked: boolean) => {
    setSelectedIds((prev) => {
      if (nextChecked) {
        if (prev.includes(friendId)) return prev;
        return [...prev, friendId];
      }
      return prev.filter((id) => id !== friendId);
    });
  };

  const canSubmit = selectedCount > 0 && !createChatMutation.isPending;

  const onCreate = async () => {
    if (!canSubmit) return;

    await createChatMutation.mutateAsync({
      title: title.trim(),
      participantIds: selectedIds,
    });

    setSelectedIds([]);
    setSearch("");
    setTitle("New chat");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Chat</Button>
      </DialogTrigger>

      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Create chat</DialogTitle>

        <div className="flex gap-2">
          <Input
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chat title..."
          />
        </div>

        <SearchInput
          searchId="create-chat-search"
          placeholder="Friend name..."
          value={search}
          onChange={setSearch}
        />

        {isError && <div>Error: {error.message}</div>}

        <ScrollArea className="max-h-96">
          {friends.map((friend) => {
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
                  onCheckedChange={(v) => toggleFriend(friend.id, v === true)}
                />
              </Item>
            );
          })}
          <div ref={sentinelRef} />
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={createChatMutation.isPending}
          >
            Cancel
          </Button>

          <Button onClick={onCreate} disabled={!canSubmit}>
            {createChatMutation.isPending
              ? "Creating..."
              : `Create Chat${selectedCount ? ` (${selectedCount})` : ""}`}
          </Button>
        </div>

        {createChatMutation.isError && (
          <div className="text-sm text-red-600 mt-2">
            Error:{" "}
            {createChatMutation.error?.message ?? "Failed to create chat"}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatDialog;
