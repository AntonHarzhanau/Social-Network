import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import { PlusCircleIcon } from "lucide-react";
import { CreatePostForm } from "@/features/post/create/ui/CreatePostForm";
import { useState } from "react";

interface CreatePostDIalogProps {
  wallId: string;
  className?: string;
}

const CreatePostDIalog = ({ wallId, className }: CreatePostDIalogProps) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button className={cn("w-full justify-center", className)}>
            <PlusCircleIcon />
            New Post
          </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="mx-auto">New Post</DialogTitle>
        </DialogHeader>

        <CreatePostForm wallId={wallId} onSuccess={() => setOpen(false)} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" type="button" form="create-post-form">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDIalog;
