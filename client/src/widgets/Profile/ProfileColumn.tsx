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
import { useAuthStore } from "@/shared/store/authStore";

const ProfileColumn = () => {
    const { id } = useAuthStore(s => s.user?.id ? s.user : { id: null });
  const contentTabs = {
    tabs: [
      { value: "photos", label: "Photos" },
      { value: "videos", label: "Videos" },
    ],
    defaultValue: "photos",
  };
  return (
    <div className="flex flex-col gap-2">
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

      <CreatePostDIalog className="mt-2" />
      <FeedsList authorId={id} />
    </div>
  );
};

export default ProfileColumn;
