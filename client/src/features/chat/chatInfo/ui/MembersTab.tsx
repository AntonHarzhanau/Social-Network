import type { Chat, ChatMember } from "@/entities/chat/model/types";
import type { ChatPermissions, PendingRoleChange } from "../model/types";

import SearchInput from "@/shared/components/SearchInput";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import AddUsersToGroupDialog from "./AddUsersToGroupDialog";
import { MemberRow } from "./MemberRow";

export function MembersTab(props: {
  chat: Chat;
  members: ChatMember[];

  search: string;
  setSearch: (v: string) => void;

  sentinelRef: React.RefObject<HTMLDivElement | null>;

  perms: ChatPermissions;

  onRemove: (memberId: string) => void;
  removePending: boolean;

  onRequestRoleChange: (p: PendingRoleChange) => void;
}) {
  const { chat, members, perms } = props;

  return (
    <>
      <SearchInput
        searchId="chat-info-members-search"
        placeholder="Search"
        value={props.search}
        onChange={props.setSearch}
      />

      {chat.type === "group" && perms.canAddMembers && (
        <AddUsersToGroupDialog chatId={chat.id} />
      )}

      <ScrollArea className="h-80">
        {members.map((m) => (
          <MemberRow
            key={m.id}
            member={m}
            perms={perms}
            onRemove={() => props.onRemove(m.id)}
            removePending={props.removePending}
            onRequestRoleChange={props.onRequestRoleChange}
          />
        ))}
        <div ref={props.sentinelRef} />
      </ScrollArea>
    </>
  );
}
