import { useMemo, useState } from "react";
import type { WorkExperiencePreview } from "@/entities/user/model/types";
import {
  useAddWorkExperienceMutation,
  useUpdateWorkExperienceMutation,
  useDeleteWorkExperienceMutation,
} from "@/entities/user/model/useUserMutations";

import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Pencil, Trash2, Plus } from "lucide-react";

import { WorkExperienceEntryForm } from "../forms";

export function WorkExperienceTab(props: {
  myUserId: string;
  items: WorkExperiencePreview[];
}) {
  const addMut = useAddWorkExperienceMutation({ myUserId: props.myUserId });
  const updMut = useUpdateWorkExperienceMutation({ myUserId: props.myUserId });
  const delMut = useDeleteWorkExperienceMutation({ myUserId: props.myUserId });

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingItem = useMemo(
    () => props.items.find((x) => x.id === editingId) ?? null,
    [props.items, editingId],
  );

  return (
    <div className="h-full flex flex-col gap-4 overflow-auto pr-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Work experience</div>
          <div className="text-xs text-muted-foreground">
            Manage your jobs history
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingId(null);
            setAdding(true);
          }}
          disabled={adding}
        >
          <Plus className="size-4 mr-2" />
          Add
        </Button>
      </div>

      {adding && (
        <WorkExperienceEntryForm
          key="add"
          saving={addMut.isPending}
          onCancel={() => setAdding(false)}
          onSubmit={async (input) => {
            await addMut.mutateAsync(input);
            setAdding(false);
          }}
        />
      )}

      <Separator />

      <div className="grid gap-3">
        {props.items.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No work experience yet.
          </div>
        )}

        {props.items.map((it) => {
          const isEditing = editingId === it.id;

          return (
            <div key={it.id} className="p-3 rounded-lg border bg-card">
              {!isEditing ? (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{it.company}</div>
                    <div className="text-sm text-muted-foreground">
                      {it.positionTitle || "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {it.startAt} → {it.endAt ?? "present"}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setAdding(false);
                        setEditingId(it.id);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => delMut.mutate(it.id)}
                      disabled={delMut.isPending}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <WorkExperienceEntryForm
                  key={it.id}
                  saving={updMut.isPending}
                  initial={{
                    company: editingItem?.company ?? "",
                    positionTitle: editingItem?.positionTitle ?? null,
                    startAt: editingItem?.startAt ?? "",
                    endAt: editingItem?.endAt ?? null,
                  }}
                  onCancel={() => setEditingId(null)}
                  onSubmit={async (input) => {
                    await updMut.mutateAsync({
                      workExperienceId: it.id,
                      input,
                    });
                    setEditingId(null);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
