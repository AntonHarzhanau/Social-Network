import { fetchUserProfile, type UserProfile } from "@/entities/user/api/userApi";
import ProfileAside from "@/widgets/Profile/ProfileAside";
import ProfileColumn from "@/widgets/Profile/ProfileColumn";
import ProfileHeader from "@/widgets/Profile/ProfileHeader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const params = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (params.userId) {
        try {
          const profile = await fetchUserProfile(params.userId);
          setUserProfile(profile);
        } catch (error) {
          console.error("Failed to load user profile:", error);
        }
      }
    };
    loadUserProfile();
  }, [params.userId]);

  return (
    <div>   
      <ProfileHeader
        name={userProfile?.username || ""}
        avatarUrl={userProfile?.avatarUrl}
      />
      <div className="flex gap-2 mt-4">
        <section className="flex flex-col flex-5 gap-2">
          <ProfileColumn userId={params.userId} />
        </section>

        <aside className="flex-3 sticky h-fit top-14">
          <ProfileAside />
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;
export const Component = ProfilePage;
