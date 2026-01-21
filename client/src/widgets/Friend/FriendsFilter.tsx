import { Button } from "../../shared/components/ui/button";
import { Card } from "../../shared/components/ui/card";
import { useFriendsFilterStore } from "../../entities/friends/model/useFriendsFilterStore";

const FriendsFilter = () => {
  const setFilter = useFriendsFilterStore((state) => state.setFilter);
  return (
    <Card className="p-1 gap-2">
      <Button
        onClick={() => setFilter("all")}
        variant="ghost"
        className="w-full justify-start"
      >
        All Friends
      </Button>
      <Button
        onClick={() => setFilter("sent")}
        variant="ghost"
        className="w-full justify-start"
      >
        Sent Requests
      </Button>
      <Button
        onClick={() => setFilter("received")}
        variant="ghost"
        className="w-full justify-start"
      >
        ReceiverRequests
      </Button>
      <Button
        onClick={() => setFilter("")}
        variant="ghost"
        className="w-full justify-start"
      >
        All Users
      </Button>
    </Card>
  );
};

export default FriendsFilter;
