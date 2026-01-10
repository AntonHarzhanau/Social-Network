import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useEffect, useState } from "react";
import { fetchUserAvatars } from "@/entities/user/api/userApi";
import { sessionUser } from "@/entities/session/model/sessionStore";
import type { MediaResponse } from "@/entities/media/model/types";
import { useMediaViewerStore } from "@/features/media/viewer/useMediaViewerStore";
import MediaBoxImageItem from "./MediaBoxImageItem";

const MediaBoxImageList = () => {
  const user = sessionUser();
  const openViewer = useMediaViewerStore((s) => s.openViewer);
  const [avatars, setAvatars] = useState<MediaResponse[]>([]);
  useEffect(() => {
    const loadAvatars = async () => {
      if (!user?.id) return;
      try {
        const fetchedAvatars = await fetchUserAvatars(user.id);
        setAvatars(fetchedAvatars);
      } catch (error) {
        console.error("Error fetching user avatars:", error);
      }
    };

    loadAvatars();
  }, [user?.id, user?.avatarUrl]);
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex justify-center">
        <div className="p-2 w-full">
          <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
            {avatars?.map((avatar) => (
              <MediaBoxImageItem
                key={avatar.id}
                media={avatar}
                onClick={() =>
                  openViewer({
                    author: user,
                    medias: avatars,
                    initialIndex: avatars.findIndex((a) => a.id === avatar.id),
                  })
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex gap-4 w-full px-2">
        <Button className="flex-1">
          <PlusCircleIcon />
          Load photos
        </Button>
        <Button className="flex-1">All photos</Button>
      </div>
    </div>
  );
};

export default MediaBoxImageList;
