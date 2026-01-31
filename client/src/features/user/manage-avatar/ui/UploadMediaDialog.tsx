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

import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { UploadMediaForm } from "./UploadMediaForm";

interface UploadMediaDialogProps {
  userId: string;
}

const UploadMediaDialog = ({ userId }: UploadMediaDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1">
          <PlusCircleIcon />
          Load photos
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="mx-auto">New Post</DialogTitle>
        </DialogHeader>

        <UploadMediaForm userId={userId} onSuccess={() => setOpen(false)} />

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

export default UploadMediaDialog;
