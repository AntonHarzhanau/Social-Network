import { Card } from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import type { MediaBoxSource } from "./model/types";
import { MediaBoxPhotosTab } from "./MediaBoxPhotosTab";
import { MediaBoxVideosTab } from "./MediaBoxVideosTab";

const MediaBox = ({ source }: { source: MediaBoxSource }) => {
  if (!source.canView) return null;

  return (
    <Card>
      <Tabs defaultValue="image">
        <TabsList className="p-2 gap-2 bg-surface">
          <TabsTrigger value="image" className="p-3">
            Photos
          </TabsTrigger>
          <TabsTrigger value="video" className="p-3">
            Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="image">
          <MediaBoxPhotosTab source={source} />
        </TabsContent>

        <TabsContent value="video">
          <MediaBoxVideosTab source={source} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MediaBox;
