import { useUserProfile } from "@/entities/user/model/useUserProfile";
import FriendsWidget from "@/widgets/Profile/FriendsWidget";
import ProfileColumn from "@/widgets/Profile/ProfileColumn";
import UserProfileHeader from "@/widgets/Profile/UserProfileHeader";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
 const { data: user, isLoading} = useUserProfile(userId); 

  return (
    <div>
      <UserProfileHeader user={user} loading={isLoading} />
      <div className="flex gap-2 mt-4">
        <section className="flex flex-col flex-5 gap-2">
          <ProfileColumn user={user} loading={isLoading} />
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
