import { Button } from "../../shared/components/ui/button";
import { Card } from "../../shared/components/ui/card";
import { useFriendsFilterStore } from "../../entities/friends/model/useFriendsFilterStore";
import { sessionStore } from "@/entities/session/model/sessionStore";
import { useMyFriendsStats } from "@/entities/friends/model/useFriendsStats";

const FriendsFilter = () => {
  const setFilter = useFriendsFilterStore((state) => state.setFilter);
  const myId = sessionStore((state) => state.user?.id);
  const { data: stats } = useMyFriendsStats(!!myId);

  const total = stats?.total ?? 0;
  const sent = stats?.sentRequests ?? 0;
  const received = stats?.receivedRequests ?? 0;

  const Badge = ({ value }: { value: number }) =>
    value > 0 ? (
      <span className="ml-auto min-w-5 h-5 px-1 rounded-full text-[11px] leading-5 text-center bg-muted text-foreground">
        {value > 99 ? "99+" : value}
      </span>
    ) : null;

  return (
    <Card className="p-1 gap-2">
      <Button
        onClick={() => setFilter("all")}
        variant="ghost"
        className="w-full justify-start"
      >
        <span>All Friends</span>
        <Badge value={total} />
      </Button>

      <Button
        onClick={() => setFilter("sent")}
        variant="ghost"
        className="w-full justify-start"
      >
        <span>Sent Requests</span>
        <Badge value={sent} />
      </Button>

      <Button
        onClick={() => setFilter("received")}
        variant="ghost"
        className="w-full justify-start"
      >
        <span>Received Requests</span>
        <Badge value={received} />
      </Button>
    </Card>
  );
};

export default FriendsFilter;
