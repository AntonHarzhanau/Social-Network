import { Button } from "@/shared/components/ui/button";
import { ChevronDown } from "lucide-react";

export function ChatJumpControls(props: {
  showNewBanner: boolean;
  newCount: number;
  showJumpArrow: boolean;
  onJump: () => void | Promise<void>;
}) {
  const { showNewBanner, newCount, showJumpArrow, onJump } = props;

  return (
    <>
      {showNewBanner && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <Button variant="secondary" className="shadow" onClick={onJump}>
            {`New messages: ${newCount} • `}Jump to latest
          </Button>
        </div>
      )}

      {showJumpArrow && (
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="shadow"
            onClick={onJump}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  );
}
