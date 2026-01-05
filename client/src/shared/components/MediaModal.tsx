
import { useEffect, useState } from "react";
import MediaCarousel from "./MediaCarousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import type { MediaResponse } from "../types/mediaResponseTypes";
import { fetchMedias } from "../api/media";
import { useAuthStore } from "../store/authStore";
import { UserAvatar } from "./UserAvatar";

const MediaModal = () => {
    const user = useAuthStore((state) => state.user);
    const [medias, setMedias] = useState<MediaResponse[] | null>(null);
    const getMedias = async () => {
        fetchMedias().then((data) => setMedias(data));
    }
    
    useEffect(() => {
        getMedias();
    }, []);

  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className="flex w-full p-2 gap-4">
        <div className=" h-full w-full">
         <MediaCarousel medias={medias} /> 
        </div>
        <DialogHeader className="">
          <DialogTitle className="flex items-center gap-2">
            <UserAvatar imageUrl={user?.avatarUrl} name={user?.username} className="w-10 h-10 " />
            <div>
                <h3 className="text-sm font-medium">{user?.username}</h3>
                
            </div>
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MediaModal;
