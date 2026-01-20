import { fetchGroupMembers } from "@/entities/group/api/groupApi";
import type { GroupMember } from "@/entities/group/model/types";
import { useGroup } from "@/entities/group/model/useGroup";
import MainSectionLayout from "@/shared/components/MainSectionLayout";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { UserAvatar } from "@/shared/components/UserAvatar";
import GroupAside from "@/widgets/Group/GroupAside";
import GroupHeader from "@/widgets/Group/GroupHeader";
import GroupPageContent from "@/widgets/Group/GroupPageContent";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading, error } = useGroup(groupId!);

  return (
    <div>
      <GroupHeader group={group} />
      <MainSectionLayout
        pageContent={<GroupPageContent group={group} />}
        asideContent={
          <>
            {(group?.role === "owner" || group?.role === "admin") && (
              <MembersList groupId={group.id} />
            )}
            <GroupAside groupId={groupId} />
          </>
        }
      />
    </div>
  );
};

export default GroupPage;
export const Component = GroupPage;

const MembersList = ({ groupId }: { groupId: string }) => {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!groupId) return;
    const fetchMembers = async () => {
      const response = await fetchGroupMembers(groupId, 1, 8);
      setMembers(response.members);
      setTotalCount(response.totalCount);
    };
    fetchMembers();
  }, [groupId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mb-2">
          Show Members
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogTitle>Group Members</DialogTitle>
        <ScrollArea className="h-96 mt-4">
          <div className="flex flex-wrap gap-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center w-full gap-2">
                <UserAvatar
                  imageUrl={member.user.avatarUrl}
                  name={member.user.name}
                  className="w-14 h-14"
                />

                <div className="flex flex-col items-start">
                  <h2 className="text-sm font-medium text-center">
                    {member.user.name}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {member.role}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="">
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
