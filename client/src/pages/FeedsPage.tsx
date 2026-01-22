import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import CreatePostDIalog from "@/features/post/create/ui/CreatePostDIalog";
import FeedsList from "@/widgets/FeedsList";
import { sessionStore } from "@/entities/session/model/sessionStore";
import MainSectionLayout from "@/shared/components/MainSectionLayout";

const FeedsPage = () => {
  const user = sessionStore((s) => s.user);
  const wallId = user?.wallId;

  return (
    <MainSectionLayout
      pageContent={
        <div className="flex flex-col flex-5 gap-2">
          {wallId && <CreatePostDIalog wallId={wallId} />}
          <FeedsList />
        </div>
      }
      asideContent={
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
      }
    />
  );
};

export default FeedsPage;
export const Component = FeedsPage;
