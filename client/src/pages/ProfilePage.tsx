import { useUserProfile } from "@/entities/user/model/useUserProfile";
import MainSectionLayout from "@/shared/components/MainSectionLayout";
import FriendsWidget from "@/widgets/Profile/FriendsWidget";
import ProfileColumn from "@/widgets/Profile/ProfileColumn";
import UserProfileHeader from "@/widgets/Profile/UserProfileHeader";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isLoading } = useUserProfile(userId);

  return (
    <div>
      <UserProfileHeader user={user} loading={isLoading} />
      <div className="flex gap-2 mt-4">
        <MainSectionLayout
          pageContent={<ProfileColumn user={user} loading={isLoading} />}
          asideContent={<FriendsWidget userId={userId} />}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
export const Component = ProfilePage;
