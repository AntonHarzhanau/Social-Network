import { useAuthStore } from "@/features/auth/model/authStore";
import FriendsFilter from "@/widgets/Friend/FriendsFilter";
import MainSectionLayout from "@/shared/components/MainSectionLayout";
import FriendsList from "@/widgets/Friend/FriendsList";

const FriendsPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <MainSectionLayout
      pageContent={<FriendsList userId={user?.id} />}
      asideContent={<FriendsFilter />}
    />
  );
};

export default FriendsPage;
export const Component = FriendsPage;
