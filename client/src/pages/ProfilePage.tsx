import FriendsWidget from "@/widgets/Profile/FriendsWidget";
import ProfileColumn from "@/widgets/Profile/ProfileColumn";
import ProfileHeader from "@/widgets/Profile/ProfileHeader";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div>
      <ProfileHeader userId={userId} />
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
