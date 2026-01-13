import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import CreatePostDIalog from "@/features/post/create/ui/CreatePostDIalog";
import FeedsList from "@/widgets/FeedsList";
import { sessionStore } from "@/entities/session/model/sessionStore";

const FeedsPage = () => {
  const user = sessionStore((s) => s.user);
  const wallId = user?.wallId;
  
  return (
    <div className="flex gap-2 p-2">
      <div className="flex flex-col flex-5 gap-2">
        {wallId && <CreatePostDIalog wallId={wallId} />}
        <FeedsList />
      </div>

      <aside className="flex-3 h-fit sticky top-14 p-2">
        <Card className="p-1">
          <Button variant="ghost" className="w-full justify-start">
            All
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Friends
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Groups
          </Button>
        </Card>
      </aside>
    </div>
  );
};

export default FeedsPage;
export const Component = FeedsPage;
