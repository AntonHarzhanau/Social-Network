import FriendsFilter from "@/widgets/Friend/FriendsFilter";
import MainSectionLayout from "@/shared/components/MainSectionLayout";
import FriendsList from "@/widgets/Friend/FriendsList";
import { sessionUser } from "@/entities/session/model/sessionStore";
import { useState } from "react";
import FindFriends from "@/widgets/Friend/FindFriends";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

const FriendsPage = () => {
  const user = sessionUser();
  const [mode, setMode] = useState<"friends" | "find">("friends");

  const pageContent =
    mode === "friends" ? (
      <FriendsList userId={user?.id} onFindFriends={() => setMode("find")} />
    ) : (
      <FindFriends onBack={() => setMode("friends")} />
    );

  const asideContent =
    mode === "friends" ? (
      <FriendsFilter />
    ) : (
      <Card className="p-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setMode("friends")}
        >
          Back to Friends
        </Button>
        {/* сюда позже можно добавить фильтры поиска */}
      </Card>
    );

  return (
    <MainSectionLayout pageContent={pageContent} asideContent={asideContent} />
  );
};

export default FriendsPage;
export const Component = FriendsPage;
