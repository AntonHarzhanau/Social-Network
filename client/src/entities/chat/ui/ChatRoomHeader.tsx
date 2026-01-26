import { CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar } from "@/shared/components/Avatar";

export function ChatRoomHeader(props: {
  title: string;
  avatarUrl?: string | null;
  onClose: () => void;
}) {
  const { title, avatarUrl, onClose } = props;

  return (
    <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar
          imageUrl={avatarUrl}
          name={title}
          className="h-10 w-10 shrink-0"
        />
        <div className="min-w-0">
          <div className="font-medium truncate">{title}</div>
        </div>
      </div>

      <Button size="sm" variant="outline" onClick={onClose}>
        Close
      </Button>
    </CardHeader>
  );
}
