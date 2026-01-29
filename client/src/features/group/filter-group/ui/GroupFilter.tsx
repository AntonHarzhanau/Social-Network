import { cn } from "@/shared/lib/utils";
import { ToggleGroup } from "@/shared/components/ui/toggle-group";
import { ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { useGroupFilterStore } from "../useGroupFilterStore";

const GroupFilter = () => {
  const filter = useGroupFilterStore((state) => state.filter);
  const setFilter = useGroupFilterStore((state) => state.setFilter);

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
        if (v) setFilter(v as "all" | "owned" | "subscribed");
      }}
      className="flex-col gap-1 w-full"
    >
      <ToggleGroupItem value="all" aria-label="all" className={style}>
        All
      </ToggleGroupItem>
      <ToggleGroupItem value="owned" aria-label="owned" className={style}>
        My Groups
      </ToggleGroupItem>
      <ToggleGroupItem
        value="subscribed"
        aria-label="subscribed"
        className={style}
      >
        Subscribed
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default GroupFilter;
