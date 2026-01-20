import { useForm } from "react-hook-form";
import {
  CreateGroupSchema,
  type CreateGroupValues,
} from "../model/CreateGroupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/shared/api/apiClient";
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

const CreateGroupForm = () => {
  const form = useForm<CreateGroupValues>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      name: "",
      visibility: "public",
    },
  });

  const handleSubmit = async (data: CreateGroupValues) => {
    console.log("Creating group with data:", data);
    await apiClient.post("/groups", data);
    form.reset();
  };
  return (
    <Dialog>
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
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="create-group-form">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CreateGroupForm;
