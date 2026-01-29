import { useForm } from "react-hook-form";
import {
  CreateGroupSchema,
  type CreateGroupValues,
} from "../model/CreateGroupSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { FormInput } from "@/shared/components/FormInput";
import { FormSelect } from "@/shared/components/FormSelect";
import { useState } from "react";
import { useCreateGroupMutation } from "@/entities/group/model/useGroupMutations";

const CreateGroupForm = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateGroupValues>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      name: "",
      visibility: "public",
    },
  });

  const createMut = useCreateGroupMutation();

  const handleSubmit = async (data: CreateGroupValues) => {
    await createMut.mutateAsync({
      name: data.name,
      visibility: data.visibility,
      // description: null,
    });

    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id="create-group-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Community</Button>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>Create Community</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <FormInput
                name="name"
                control={form.control}
                label="Name"
                type="text"
                placeholder="Community name"
                autoComplete="off"
              />

              <FormSelect<CreateGroupValues, "public" | "private">
                name="visibility"
                control={form.control}
                label="Visibility"
                placeholder="Select visibility"
                options={[
                  { value: "public", label: "Public" },
                  { value: "private", label: "Private" },
                ]}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                disabled={createMut.isPending}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              form="create-group-form"
              disabled={createMut.isPending}
            >
              {createMut.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CreateGroupForm;
