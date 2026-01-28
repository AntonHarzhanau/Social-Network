import { useState } from "react";
import { CirclePlus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { sessionStore } from "@/entities/session/model/sessionStore";
import { useFriends } from "@/entities/friends/model/useFriends";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";
import { useAddMemberMutation } from "../../../../entities/chat/model/hooks/useChatMutation";

import { SelectUsersDialog } from "../../../../entities/chat/ui/SelectUsersDialog";

const AddUsersToGroupDialog = ({ chatId }: { chatId: string }) => {
  const user = sessionStore((s) => s.user);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);

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

  const addMembers = useAddMemberMutation();

  return (
    <SelectUsersDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button className="flex items-center gap-2 mb-2 mt-2">
          <CirclePlus className="h-4 w-4" />
          <span>Add Member</span>
        </Button>
      }
      title="Add Users to Group"
      users={friends ?? []}
      isLoading={addMembers.isPending}
      isError={isError}
      error={error ?? null}
      search={search}
      setSearch={setSearch}
      sentinelRef={sentinelRef}
      submitText={(count) =>
        addMembers.isPending ? "Adding..." : `Add (${count})`
      }
      onSubmit={(selectedIds) =>
        addMembers
          .mutateAsync({ chatId, userIds: selectedIds })
          .then(() => setOpen(false))
      }
    />
  );
};

export default AddUsersToGroupDialog;
