import type { Me } from "@/shared/api/auth";
import { fetchUsers } from "@/shared/api/user";
import SearchInput from "@/shared/components/SearchInput";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import FriendListItem from "@/widgets/Friend/FriendListItem";
import { useEffect, useState } from "react";

const FriendsPage = () => {
  const [users, setUsers] = useState<Me[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);
  return (
    <div className="flex gap-2">
      <Card className="flex flex-col flex-5 px-2">
        <div className="flex flex-col w-full gap-2">
          <div className="flex gap-2">
            <Button variant="outline" className="">
                <div className="flex gap-2">
                    <h3 className="">All</h3>
                    <p className="text-sm text-muted-foreground">{177}</p>
                </div>
            </Button>
            <Button variant="outline"className="">
                <div className="flex gap-2">
                    <h3 className="">Online</h3>
                    <p className="text-sm text-muted-foreground">{20}</p>
                </div>
            </Button>
            <Button className="ml-auto">Find Friends</Button>
          </div>
          <SearchInput />
        </div>
        {users.map((user) => (
          <FriendListItem key={user.id} user={user} />
        ))}
      </Card>
      <div className="flex-3">
        <Card className="py-2 gap-1 min-h-48"></Card>
      </div>
    </div>
  );
};

export default FriendsPage;
export const Component = FriendsPage;
