import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface ExpandableDescriptionProps {
  content: string;
  limit?: number;
  classname?: string;
}

const ExpandableDescription = ({
  content,
  limit = 10,
  classname,
}: ExpandableDescriptionProps) => {
  const isLong = content.length > limit;
  const [open, setOpen] = useState(false);
  const onClick = () => {
    setOpen(!open);
  };
  
  return (
    <div className={cn("", classname)}>
      {isLong ? (
        <div>
          <div className="text-accent-foreground mb-2">
            {!open ? content.slice(0, limit) + "..." : content}
          </div>
          <Button
            variant="link"
            onClick={() => onClick()}
            className="p-0 h-auto text-muted-foreground "
          >
            {open ? "Hide" : "Show more"}
          </Button>
        </div>
      ) : (
        <p className="text-accent-foreground whitespace-pre-wrap wrap-break-words wrap-anywhere">
          {content}
        </p>
      )}
    </div>
  );
};

export default ExpandableDescription;
