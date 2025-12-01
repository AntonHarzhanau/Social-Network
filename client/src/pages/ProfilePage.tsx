import ProfileAside from "@/widgets/Profile/ProfileAside";
import ProfileColumn from "@/widgets/Profile/ProfileColumn";
import ProfileHeader from "@/widgets/Profile/ProfileHeader";


const ProfilePage = () => {
  return (
    <div>
      <ProfileHeader />
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
