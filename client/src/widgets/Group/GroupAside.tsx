import { useGroupMembers } from "@/entities/group/model/useGroupMembers";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Avatar } from "@/shared/components/Avatar";
import { Link } from "react-router-dom";
import type { Group } from "@/entities/group/model/types";
import { MembersDialog } from "@/features/group/manage-members/ui/MembersDialog";
import { sessionStore } from "@/entities/session/model/sessionStore";

interface GroupAsideProps {
  group: Group;
}

const GroupAside = ({ group }: GroupAsideProps) => {
  const user = sessionStore((s) => s.user);
  const { members, totalCount, isLoading, isError } = useGroupMembers({
    groupId: group.id || "",
    status: "accepted",
    limit: 8,
    enabled: !!group.id,
  });

  if (!group.id || !user) return null;

  return (
    <aside>
      {(group?.role === "owner" || group?.role === "admin") && (
        <MembersDialog
          groupId={group.id}
          myRole={group.role}
          myUserId={user?.id}
        />
      )}
      <Card className="h-fit w-full p-2 m-0 gap-0">
        <CardHeader className="px-0">
          <Link to={`/group/${group.id}`} className="flex gap-2">
            <h2 className="text-sm font-bold hover:underline">Members</h2>
            <p className="text-sm font-medium text-muted-foreground">
              {totalCount}
            </p>
          </Link>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2 py-0 px-0">
          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading...</div>
          )}
          {isError && (
            <div className="text-sm text-destructive">
              Failed to load members
            </div>
          )}

          {!isLoading &&
            !isError &&
            members.map((member) => (
              <Link
                key={member.id}
                to={`/profile/${member.user.id}`}
                className="flex flex-col items-center"
              >
                <Avatar
                  imageUrl={member.user.avatarUrl}
                  name={member.user.name}
                  isOnline={member.user.isOnline}
                  className="w-14 h-14"
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
