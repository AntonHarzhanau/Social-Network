import { Card } from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import MediaBoxVideoList from "./MediaBoxVideoList";
import MediaBoxImageList from "./MediaBoxImageList";

interface MediaBoxProps {
  id: string;
  forGroup?: boolean;
}

const MediaBox = ( { id, forGroup = false }: MediaBoxProps) => {
    void id;
    void forGroup;
  const contentTabs = {
    tabs: [
      { value: "photos", label: "Photos" },
      { value: "videos", label: "Videos" },
    ],
    defaultValue: "photos",
  };

  return (
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
            <MediaBoxImageList />
        </TabsContent>

        {/* Videos */}
        <TabsContent value="videos" className="p-2">
          <MediaBoxVideoList />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MediaBox;
