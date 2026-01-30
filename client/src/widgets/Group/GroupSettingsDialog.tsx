import { useEffect, useMemo, useState } from "react";

import type { Group } from "@/entities/group/model/types";
import { useUpdateGroupSettingsMutation } from "@/entities/group/model/useGroupMutations";

import GroupProfileAvatar from "@/features/group/manage-avatar/ui/GroupProfileAvatar";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type Visibility = "public" | "private";

interface GroupSettingsDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  group?: Group;
}

export function GroupSettingsDialog({
  open,
  onOpenChange,
  group,
}: GroupSettingsDialogProps) {
  const updateMut = useUpdateGroupSettingsMutation();

  const canEdit = useMemo(() => {
    const role = group?.role;
    return role === "owner" || role === "admin";
  }, [group?.role]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [visibility, setVisibility] = useState<Visibility>("public");

  useEffect(() => {
    if (!open || !group) return;
    setName(group.name ?? "");
    setDescription(group.description ?? "");
    setVisibility((group.visibility ?? "public") as Visibility);
  }, [open, group?.id]);

  const isBusy = updateMut.isPending;
  const isValid = name.trim().length >= 2;

  const onCancel = () => {
    onOpenChange(false);
  };

  const onSave = async () => {
    if (!group || !canEdit) return;

    await updateMut.mutateAsync({
      groupId: group.id,
      patch: {
        name: name.trim(),
        description: description.trim() ? description.trim() : null,
        visibility,
      },
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle>Group settings</DialogTitle>
          </DialogHeader>

          {/* Top block: centered avatar + name */}
          <div className="mt-5 flex flex-col items-center text-center gap-1">
            <div className="h-24 w-24 sm:h-28 sm:w-28">
              <GroupProfileAvatar
                groupId={group?.id}
                avatarUrl={group?.currentAvatar?.url}
                name={group?.name}
                isOwner={!!group && canEdit}
              />
            </div>

            <div className="mt-4 w-full max-w-[420px]">
              <Label htmlFor="group-name" className="sr-only">
                Group name
              </Label>
              <Input
                id="group-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Group name"
                disabled={!canEdit || isBusy}
                className="text-center text-base sm:text-lg font-medium"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                {group?.subscribersCount ?? 0} members
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Form fields */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="group-description">Description</Label>
              <Textarea
                id="group-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell something about this group…"
                disabled={!canEdit || isBusy}
                className="min-h-[110px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Privacy</Label>
              <Select
                value={visibility}
                onValueChange={(v) => setVisibility(v as Visibility)}
                disabled={!canEdit || isBusy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select privacy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">public</SelectItem>
                  <SelectItem value="private">private</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                Private groups require approval to join and may hide posts for
                non-members.
              </p>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="mt-7 flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled={!canEdit || isBusy || !isValid}>
              Save
            </Button>
          </div>

          {!canEdit && group ? (
            <p className="mt-3 text-xs text-muted-foreground">
              You don’t have permissions to edit this group.
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
