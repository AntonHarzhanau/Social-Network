import SearchInput from "@/shared/components/SearchInput";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import FriendListItem from "./FriendListItem";
import type { Me } from "@/shared/api/auth";

interface FriendsListProps {
  users: Me[];
}

const FriendsList = ({ users }: FriendsListProps) => {
  return (
    <Card className="flex flex-col w-full gap-2 px-2">
      <div className="flex gap-2">
        <Button variant="outline" className="">
          <div className="flex gap-2">
            <h3 className="">All</h3>
            <p className="text-sm text-muted-foreground">{177}</p>
          </div>
        </Button>
        <Button variant="outline" className="">
          <div className="flex gap-2">
            <h3 className="">Online</h3>
            <p className="text-sm text-muted-foreground">{20}</p>
          </div>
        </Button>
        <Button className="ml-auto">Find Friends</Button>
      </div>
      <SearchInput />
      {users.map((user) => (
        <FriendListItem key={user.id} user={user} />
      ))}
    </Card>
  );
};

export default FriendsList;
