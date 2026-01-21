import { fetchGroupMembers } from "@/entities/group/api/groupApi";
import type { GroupMember } from "@/entities/group/model/types";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Avatar } from "@/shared/components/Avatar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface GroupAsideProps {
  groupId?: string;
}

const GroupAside = ({ groupId }: GroupAsideProps) => {
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
    <aside>
      <Card className="h-fit w-full p-2 m-0 gap-0">
        <CardHeader className="px-0">
          <Link to={`/groups/${groupId}`} className="flex gap-2 ">
            <h2 className="text-sm font-bold hover:underline">Members</h2>
            <p className="text-sm font-medium text-muted-foreground">
              {totalCount}
            </p>
          </Link>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 py-0 px-0">
          {members.map((member) => (
            <Link
              key={member.id}
              to={`/profile/${member.user.id}`}
              className="flex flex-col items-center"
            >
              <Avatar
                imageUrl={member.user.avatarUrl}
                name={member.user.name}
                className="w-18 h-18"
              />
              <p className="text-sm">{member.user.name.split(" ")[0]}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
};

export default GroupAside;
