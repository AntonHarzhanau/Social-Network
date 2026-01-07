import { fetchUserProfile } from "@/entities/user/api/userApi";
import type { UserProfile } from "@/entities/user/model/types";
import FriendsWidget from "@/widgets/Profile/FriendsWidget";
import ProfileColumn from "@/widgets/Profile/ProfileColumn";
import ProfileHeader from "@/widgets/Profile/ProfileHeader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (userId) {
        try {
          const profile = await fetchUserProfile(userId);
          setUserProfile(profile);
        } catch (error) {
          console.error("Failed to load user profile:", error);
        }
      }
    };
    loadUserProfile();
  }, [userId]);

  return (
    <div>   
      <ProfileHeader
        name={userProfile?.username || ""}
        avatarUrl={userProfile?.avatarUrl}
      />
      <div className="flex gap-2 mt-4">
        <section className="flex flex-col flex-5 gap-2">
          <ProfileColumn userId={userId} />
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
