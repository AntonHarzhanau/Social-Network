import { Card } from "@/shared/components/ui/card";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { cn } from "@/shared/lib/utils";
import {
  usePostFilterStore,
  type PostFilterType,
} from "../model/usePostFilterStore";

const PostFilter = () => {
  const filter = usePostFilterStore((state) => state.filter);
  const setFilter = usePostFilterStore((state) => state.setFilter);

  const style = cn(
    "w-full min-h-10 justify-start px-4 py-2 rounded-md border border-transparent",
    "hover:bg-accent/50",
    "data-[state=on]:bg-accent/80 data-[state=on]:text-accent-foreground text-left",
  );

  return (
    <Card className="py-2">
      <ToggleGroup
        variant="outline"
        type="single"
        value={filter}
        onValueChange={(v) => {
          if (v) setFilter(v as PostFilterType);
        }}
        className="flex-col gap-1 w-full"
      >
        <ToggleGroupItem value="all" aria-label="all" className={style}>
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="friends" aria-label="friends" className={style}>
          Friends
        </ToggleGroupItem>
        <ToggleGroupItem value="groups" aria-label="groups" className={style}>
          Groups
        </ToggleGroupItem>
      </ToggleGroup>
    </Card>
  );
};

export default PostFilter;
