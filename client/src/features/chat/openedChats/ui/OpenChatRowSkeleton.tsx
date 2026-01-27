import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { X } from "lucide-react";

export const OpenChatRowSkeleton = ({ active }: { active: boolean }) => {
  return (
    <div
      className={`flex items-center gap-2 rounded-md p-1 ${
        active ? "bg-accent/70" : "hover:bg-accent/50"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-32 max-w-full" />
      </div>

      <Button variant="ghost" size="icon" disabled aria-label="Close chat">
        <X className="h-4 w-4 opacity-40" />
      </Button>
    </div>
  );
};
