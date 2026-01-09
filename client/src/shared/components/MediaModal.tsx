import MediaCarousel from "./PostMediaCarousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useQuery } from "@tanstack/react-query";
import type { MediaResponse } from "../../entities/media/model/mediaResponseTypes";
import { fetchUserAvatars } from "@/entities/user/api/userApi";

interface MediaModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MediaModal = ({ userId, open, onOpenChange }: MediaModalProps) => {
  const {
    data: userAvatars,
    isLoading,
    isError,
  } = useQuery<MediaResponse[]>({
    queryKey: ["userAvatars", userId],
    queryFn: () => fetchUserAvatars(userId),
    enabled: open,
    staleTime: 60_000,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
      aria-describedby={undefined}
      className="flex w-full p-2 gap-4">
        <div className="h-full w-full">
          {isLoading && <div className="p-4 text-sm text-muted-foreground">Loading...</div>}
          {isError && <div className="p-4 text-sm text-destructive">Failed to load avatars</div>}
          {!isLoading && userAvatars?.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">No avatars</div>
          )}
          {!!userAvatars?.length && <MediaCarousel medias={userAvatars} />}
        </div>

        <DialogHeader>
          <DialogTitle>Avatars</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MediaModal;
