import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import type { MemberRole } from "@/entities/group/model/types";
import { MembersTab } from "./tabs/MembersTab";
import { RequestsTab } from "./tabs/RequestsTab";
import { BlacklistTab } from "./tabs/BlackListTab";

export function MembersDialog(props: {
  groupId: string;
  myRole: MemberRole;
  myUserId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mb-2">
          Manage Members
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogTitle>Group Members</DialogTitle>

        <Tabs defaultValue="members" className="mt-3">
          <TabsList className="w-full">
            <TabsTrigger value="members" className="flex-1">
              Members
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">
              Requests
            </TabsTrigger>
            <TabsTrigger value="blacklist" className="flex-1">
              Blacklist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <MembersTab
              groupId={props.groupId}
              myRole={props.myRole}
              myUserId={props.myUserId}
            />
          </TabsContent>

          <TabsContent value="requests">
            <RequestsTab groupId={props.groupId} />
          </TabsContent>

          <TabsContent value="blacklist">
            <BlacklistTab groupId={props.groupId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
