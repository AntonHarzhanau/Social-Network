import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import MediaBoxImageItem from "./MediaBoxImageItem";
import { useEffect, useState } from "react";
import { fetchUserAvatars } from "@/entities/user/api/userApi";
import { sessionUser } from "@/entities/session/model/sessionStore";
import { MediaAssetModal } from "@/widgets/media-modal/MediaAssetModal";
import type { MediaResponse } from "@/entities/media/model/types";

const MediaBoxImageList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const user = sessionUser();
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
              //   <MediaBoxImageItem key={avatar.id} media={avatar} />
              <div className="aspect-square bg-amber-800">
                <img
                  src={avatar?.url}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover"
                  onClick={() => {
                    setSelectedIndex(avatars.indexOf(avatar));
                    setIsModalOpen(true);
                  }}
                />
              </div>
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
      {avatars?.length > 0 && (
        <MediaAssetModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          author={{
            id: user?.id || "",
            username: user?.username || "",
            avatarUrl: user?.avatarUrl || undefined,
          }}
          medias={avatars}
          initialIndex={selectedIndex}
        />
      )}
    </div>
  );
};

export default MediaBoxImageList;
