import { Button } from "@/shared/components/ui/button";
import { ChevronDown } from "lucide-react";

interface MessageListControlsProps {
  isAtBottom: boolean;
  hasUnread: boolean;
  onScrollToBottom: () => void;
}

export function MessageListControls({
  isAtBottom,
  hasUnread,
  onScrollToBottom,
}: MessageListControlsProps) {
  if (isAtBottom) return null;

  return (
    <div>
      {hasUnread && (
        <div
          onClick={onScrollToBottom}
          className="absolute bottom-0 left-0 w-full h-12 flex justify-center items-center bg-muted/50 cursor-pointer"
        >
          New Messages
        </div>
      )}

      <Button
        onClick={onScrollToBottom}
        className="absolute bottom-4 right-4 rounded-full bg-primary/40 px-3 py-1 text-xs text-primary-foreground shadow-md flex items-center gap-1 w-8 h-8"
      >
        <ChevronDown size={12} />
      </Button>
    </div>
  );
}
