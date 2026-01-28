import { useState } from "react";
import type { ReactNode } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

import type { UserPreview } from "@/entities/user/model/types";
import SelectUsers from "./SelectUsers";

type SelectUsersDialogProps = {
  trigger: ReactNode;
  title: string;

  users: UserPreview[];
  isLoading?: boolean;
  isError: boolean;
  error: Error | null;

  search: string;
  setSearch: (v: string) => void;

  sentinelRef: React.RefObject<HTMLDivElement | null>;

  headerSlot?: ReactNode;

  submitText: (selectedCount: number) => string;
  onSubmit: (selectedIds: string[]) => Promise<void> | void;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  initialSelectedIds?: string[];

  disabled?: boolean;
};

export function SelectUsersDialog(props: SelectUsersDialogProps) {
  const [innerOpen, setInnerOpen] = useState(false);
  const open = props.open ?? innerOpen;
  const setOpen = props.onOpenChange ?? setInnerOpen;

  const [selectedIds, setSelectedIds] = useState<string[]>(
    props.initialSelectedIds ?? [],
  );

  const toggle = (userId: string, nextChecked: boolean) => {
    setSelectedIds((prev) => {
      if (nextChecked) return prev.includes(userId) ? prev : [...prev, userId];
      return prev.filter((id) => id !== userId);
    });
  };

  const selectedCount = selectedIds.length;

  const canSubmit =
    !props.disabled && selectedCount > 0 && !(props.isLoading ?? false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    await props.onSubmit(selectedIds);

    // сброс после успеха
    setSelectedIds(props.initialSelectedIds ?? []);
    props.setSearch("");
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>

      <DialogContent aria-describedby={undefined}>
        <DialogTitle>{props.title}</DialogTitle>

        {props.headerSlot}

        <SelectUsers
          users={props.users ?? []}
          search={props.search}
          setSearch={props.setSearch}
          isError={props.isError}
          error={props.error}
          selectedIds={selectedIds}
          toggle={toggle}
          sentinelRef={props.sentinelRef}
        />

        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogClose>

          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {props.submitText(selectedCount)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
