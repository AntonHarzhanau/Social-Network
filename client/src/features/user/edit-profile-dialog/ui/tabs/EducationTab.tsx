import { useMemo, useState } from "react";
import type { EducationPreview } from "@/entities/user/model/types";
import {
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} from "@/entities/user/model/useUserMutations";

import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Pencil, Trash2, Plus } from "lucide-react";

import { EducationEntryForm } from "../forms";

export function EducationTab(props: {
  myUserId: string;
  items: EducationPreview[];
}) {
  const addMut = useAddEducationMutation({ myUserId: props.myUserId });
  const updMut = useUpdateEducationMutation({ myUserId: props.myUserId });
  const delMut = useDeleteEducationMutation({ myUserId: props.myUserId });

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
          <div className="text-sm font-medium">Education</div>
          <div className="text-xs text-muted-foreground">
            Add, edit or remove entries
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
        <EducationEntryForm
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
          <div className="text-sm text-muted-foreground">No education yet.</div>
        )}

        {props.items.map((it) => {
          const isEditing = editingId === it.id;

          return (
            <div key={it.id} className="p-3 rounded-lg border bg-card">
              {!isEditing ? (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {it.institutionName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {it.programName || "—"} • {it.degree || "—"}
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
                <EducationEntryForm
                  key={it.id}
                  saving={updMut.isPending}
                  initial={{
                    institutionName: editingItem?.institutionName ?? "",
                    programName: editingItem?.programName ?? null,
                    degree: editingItem?.degree ?? null,
                    startAt: editingItem?.startAt ?? "",
                    endAt: editingItem?.endAt ?? null,
                  }}
                  onCancel={() => setEditingId(null)}
                  onSubmit={async (input) => {
                    await updMut.mutateAsync({ educationId: it.id, input });
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
