import { Item } from "@/shared/components/ui/item";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const ChatListItemSkeleton = () => {
  return (
    <Item variant="default" className="p-2">
      <div className="flex items-center gap-2 min-w-0 w-full">
        <Skeleton className="w-12 h-12 rounded-full" />

        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 rounded w-3/4" />
          <Skeleton className="h-3 rounded w-full" />
        </div>
      </div>
    </Item>
  );
};
