import FriendsFilter from "@/widgets/Friend/FriendsFilter";
import MainSectionLayout from "@/shared/components/MainSectionLayout";
import FriendsList from "@/widgets/Friend/FriendsList";
import { sessionUser } from "@/entities/session/model/sessionStore";

const FriendsPage = () => {
  const user = sessionUser();

  return (
    <MainSectionLayout
      pageContent={<FriendsList userId={user?.id} />}
      asideContent={<FriendsFilter />}
    />
  );
};

export default FriendsPage;
export const Component = FriendsPage;
