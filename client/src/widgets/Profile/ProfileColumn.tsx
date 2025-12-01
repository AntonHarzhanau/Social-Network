import {
  Card,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import CreatePostDIalog from "../CreatePostForm/CreatePostDIalog";
import ProfileImageContent from "./ProfileImageContent";
import ProfileVideoContent from "./ProfileVideoContent";
import FeedsList from "../FeedsList";

const ProfileColumn = () => {
  const contentTabs = {
    tabs: [
      { value: "photos", label: "Photos" },
      { value: "videos", label: "Videos" },
    ],
    defaultValue: "photos",
  };
  return (
    <div>
      <Card>
        <Tabs defaultValue={contentTabs.defaultValue}>
          <TabsList className="p-2 gap-2 bg-surface">
            {contentTabs.tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="p-3">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Photos */}
          <TabsContent value="photos">
            <ProfileImageContent />
          </TabsContent>

          {/* Videos */}
          <TabsContent value="videos" className="p-2">
            <ProfileVideoContent />
          </TabsContent>
        </Tabs>
      </Card>

      <CreatePostDIalog />
      <FeedsList />
    </div>
  );
};

export default ProfileColumn;
