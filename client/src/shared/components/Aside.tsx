import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface AsideProps {
  setFilter: (filter: string) => void;
}

const Aside = ({ setFilter }: AsideProps) => {
  return (
    <Card className="p-1 gap-2">
      <Button
        onClick={() => setFilter("")}
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
        onClick={() => setFilter("all")}
        variant="ghost"
        className="w-full justify-start"
      >
        All Users
      </Button>

    </Card>
  );
};

export default Aside;
