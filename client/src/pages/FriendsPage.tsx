import type { Me } from "@/shared/api/auth";
import { fetchUsers } from "@/shared/api/user";
import { Item, ItemMedia } from "@/shared/components/ui/item";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useEffect, useState } from "react";

const FriendsPage = () => {

    const [users, setUsers] = useState<Me[]>([]);

    useEffect(() => {
        const loadUsers = async () => {
            const data = await fetchUsers();
            setUsers(data);
        }
        loadUsers();
    }, []);
  return <div className="flex flex-col">
    {users.map((user) => (
        <Item variant='outline' key={user.id}>
            <ItemMedia variant="icon" className="w-12 h-12 rounded-full" >
          <UserAvatar imageUrl={user.avatarUrl} alt={user.username} name={user.username} />
        </ItemMedia>
            <h2>{user.username}</h2>
        </Item>
    ))}
  </div>;
};

export default FriendsPage;
export const Component = FriendsPage;
