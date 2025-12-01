import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import CreatePostDIalog from "@/widgets/CreatePostForm/CreatePostDIalog";
import FeedsList from "@/widgets/FeedsList";

const FeedsPage = () => {
  return (
    <div className="flex gap-2 p-2">
      <div className="flex flex-col flex-5 gap-2">
        <CreatePostDIalog />
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
