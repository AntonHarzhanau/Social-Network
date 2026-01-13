import type { MediaPreview } from "@/entities/media/model/types";

interface MediaBoxImageItemProps {
  media: MediaPreview;
  onClick?: () => void;

}
const MediaBoxImageItem = ({ media, onClick }: MediaBoxImageItemProps) => {
  return (
    <div key={media.id} className="aspect-square bg-amber-800" onClick={onClick}>
      <img
        src={media.url}
        alt=""
        loading="lazy"
        draggable={false}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default MediaBoxImageItem;
