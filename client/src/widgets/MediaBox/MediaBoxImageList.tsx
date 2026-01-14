import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useEffect, useState } from "react";
import { fetchUserMedias } from "@/entities/user/api/userApi";
import { sessionUser } from "@/entities/session/model/sessionStore";
import type { MediaPreview } from "@/entities/media/model/types";
import { useMediaViewerStore } from "@/features/media/viewer/useMediaViewerStore";
import MediaBoxImageItem from "./MediaBoxImageItem";
import UploadMediaDialog from "@/features/user/manage-avatar/ui/UploadMediaDialog";

const MediaBoxImageList = () => {
  const user = sessionUser();
  const openViewer = useMediaViewerStore((s) => s.openViewer);
  const [medias, setMedias] = useState<MediaPreview[]>([]);
  useEffect(() => {
    const loadMedias = async () => {
      if (!user?.id) return;
      try {
        const fetchedMedias = await fetchUserMedias(user.id, "image");
        setMedias(fetchedMedias);
      } catch (error) {
        console.error("Error fetching user medias:", error);
      }
    };

    loadMedias();
  }, [user?.id, user?.avatarUrl]);
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex justify-center">
        <div className="p-2 w-full">
          <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
            {medias?.map((media) => (
              <MediaBoxImageItem
                key={media.id}
                media={media}
                onClick={() =>
                  openViewer({
                    author: user,
                    medias: medias,
                    initialIndex: medias.findIndex((a) => a.id === media.id),
                  })
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex gap-4 w-full px-2">
        <UploadMediaDialog userId={user?.id!} />
        <Button className="flex-1">All photos</Button>
      </div>
    </div>
  );
};

export default MediaBoxImageList;
