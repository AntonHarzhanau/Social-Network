import { X } from "lucide-react";

const MediaModalCloseButton = ({ onOpenChange }: { onOpenChange: (open: boolean) => void }) => {
  return (
    <button
      type="button"
      onClick={() => onOpenChange(false)}
      className="absolute left-3 top-3 z-50 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 border border-white/10"
    >
      <X className="h-5 w-5" />
    </button>
  );
};

export default MediaModalCloseButton;
