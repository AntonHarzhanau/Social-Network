import { useAuthStore } from "@/shared/store/authStore";
import ProfileAside from "@/widgets/Profile/ProfileAside";
import ProfileColumn from "@/widgets/Profile/ProfileColumn";
import ProfileHeader from "@/widgets/Profile/ProfileHeader";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

const ProfilePage = () => {
  const params = useParams<{ userId: string }>();
  const { username, avatarUrl } = useAuthStore(
    useShallow((state) => ({
      username: state.user?.username,
      avatarUrl: state.user?.avatarUrl,
    })),
  );

  return (
    <div>
        <div>{params.userId}</div>
      <ProfileHeader name={username || ""} imageId={avatarUrl} />
      <div className="flex gap-2 mt-4">
        <section className="flex flex-col flex-5 gap-2">
          <ProfileColumn />
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
