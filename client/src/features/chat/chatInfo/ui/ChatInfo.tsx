import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useState, type ReactNode } from "react";

import type { Chat } from "@/entities/chat/model/types";
import { Avatar } from "@/shared/components/Avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

import { RoleChangeConfirmDialog } from "./RoleChangeConfirmDialog";
import { MembersTab } from "./MembersTab";
import { useChatInfoController } from "../model/useChatInfoController";

const ChatInfo = ({ children, chat }: { children: ReactNode; chat: Chat }) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);

  const c = useChatInfoController(chat, debouncedSearch);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        aria-describedby={undefined}
        className="w-[90vw] h-[90vh] "
      >
        <DialogTitle hidden />

        <div className="flex flex-col w-full items-center p-4">
          <div className="flex flex-col items-center">
            <Avatar
              imageUrl={chat.avatarUrl}
              name={chat.title}
              className="h-20 w-20 mb-4"
            />
            <h2 className="text-lg font-semibold">{chat.title}</h2>
          </div>

          <Tabs defaultValue="members" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="photo">Photo</TabsTrigger>
            </TabsList>

            <TabsContent value="members">
              <MembersTab
                chat={chat}
                members={c.members}
                search={search}
                setSearch={setSearch}
                sentinelRef={c.sentinelRef}
                perms={c.perms}
                onRemove={c.removeMember}
                onRequestRoleChange={c.requestRoleChange}
                removePending={c.removePending}
              />
            </TabsContent>

            <TabsContent value="photo">Photo</TabsContent>
          </Tabs>
        </div>

        <RoleChangeConfirmDialog
          pending={c.pendingRoleChange}
          onClose={c.cancelRoleChange}
          confirming={c.changeRolePending}
          onConfirm={c.confirmRoleChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChatInfo;
