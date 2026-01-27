import { useChatFilterStore } from "../model/useChatFilterStore";
import { cn } from "@/shared/lib/utils";
import { ToggleGroup } from "@/shared/components/ui/toggle-group";
import { ToggleGroupItem } from "@radix-ui/react-toggle-group";

const ChatFilter = () => {
  const filter = useChatFilterStore((state) => state.filter);
  const setFilter = useChatFilterStore((state) => state.setFilter);

  const style = cn(
    "w-full min-h-10 justify-start px-4 py-2 rounded-md border border-transparent",
    "hover:bg-accent/50",
    "data-[state=on]:bg-accent/80 data-[state=on]:text-accent-foreground text-left",
  );

  return (
    <ToggleGroup
      variant="outline"
      type="single"
      value={filter}
      onValueChange={(v) => {
        if (v) setFilter(v as "all" | "unread");
      }}
      className="flex-col gap-1 w-full"
    >
      <ToggleGroupItem value="all" aria-label="all" className={style}>
        All
      </ToggleGroupItem>
      <ToggleGroupItem value="unread" aria-label="unread" className={style}>
        Unread
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ChatFilter;
