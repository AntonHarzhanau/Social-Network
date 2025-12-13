import type { Me } from "@/shared/api/auth";
import { fetchFriends } from "@/shared/api/friends";
import { fetchUsers } from "@/shared/api/user";
import Aside from "@/shared/components/Aside";
import MainSectionLayout from "@/shared/components/MainSectionLayout";
import FriendsList from "@/widgets/Friend/FriendsList";
import { useEffect, useState } from "react";

const FriendsPage = () => {
  const [filter, setFilter] = useState<string>("");
  const [users, setUsers] = useState<Me[]>([]);

  useEffect(() => {
    const loadFriends = async () => {
      const data = await fetchFriends(filter);
      setUsers(data);
    };
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };

    if (filter === "all") {
      loadUsers();
    } else {
      loadFriends();
    }
  }, [filter]);
  
  return (
    <MainSectionLayout
      pageContent={<FriendsList users={users} />}
      asideContent={<Aside setFilter={setFilter} />}
    />
  );
};

export default FriendsPage;
export const Component = FriendsPage;
