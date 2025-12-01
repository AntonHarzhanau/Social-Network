import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import { PlusCircleIcon } from "lucide-react";
import { CreatePostForm } from "@/widgets/CreatePostForm/CreatePostForm";

interface CreatePostDIalogProps {
    className?: string;
}

const CreatePostDIalog = ({ className }: CreatePostDIalogProps) => {
  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button className={cn("w-full justify-center", className)}>
            <PlusCircleIcon />
            New Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mx-auto">New Post</DialogTitle>
        </DialogHeader>

        <CreatePostForm />

        <DialogFooter>
          <Button type="submit" form="create-post-form">
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDIalog;
