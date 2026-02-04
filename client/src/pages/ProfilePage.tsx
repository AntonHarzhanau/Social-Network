import { useUserProfile } from "@/entities/user/model/useUserProfile";
import MainSectionLayout from "@/shared/components/MainSectionLayout";
import FriendsWidget from "@/widgets/Profile/FriendsWidget";
import ProfileColumn from "@/widgets/Profile/ProfileColumn";
import UserProfileHeader from "@/widgets/Profile/UserProfileHeader";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();

  const profileQuery = useUserProfile(userId);
  console.log(profileQuery.data)

  return (
    <div>
      <UserProfileHeader
        user={profileQuery.data}
        loading={profileQuery.isPending}
      />

      <div className="flex gap-2 mt-4">
        <MainSectionLayout
          pageContent={
            <>
              {profileQuery.data?.canViewPrivateSummary ? <ProfileColumn
                user={profileQuery.data}
                loading={profileQuery.isPending}
              /> : (
                <h2>This User's Profile is Private</h2>
              )}
            </>
          }
          asideContent={
            <>
              {profileQuery.data?.canViewPrivateSummary ? (
                <FriendsWidget userId={profileQuery.data?.public.id} />
              ) : null
              }
            </>
          }
        />
      </div>
    </div>
  );
};

export default ProfilePage;
export const Component = ProfilePage;
