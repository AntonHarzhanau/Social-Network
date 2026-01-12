import { fetchUserProfile } from "@/entities/user/api/userApi";
import type { UserProfile } from "@/entities/user/model/types";
import FriendsWidget from "@/widgets/Profile/FriendsWidget";
import ProfileColumn from "@/widgets/Profile/ProfileColumn";
import UserProfileHeader from "@/widgets/Profile/UserProfileHeader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUser = async () => {
        if (!userId) return;
        const response = await fetchUserProfile(userId);
        setUser(response);
    }
    loadUser();
  }, [userId]);

  return (
    <div>
      <UserProfileHeader userId={userId} />
      <div className="flex gap-2 mt-4">
        <section className="flex flex-col flex-5 gap-2">
          <ProfileColumn user={user} />
        </section>

        <aside className="flex-3 sticky h-fit top-14">
          <FriendsWidget userId={userId} />
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;
export const Component = ProfilePage;
