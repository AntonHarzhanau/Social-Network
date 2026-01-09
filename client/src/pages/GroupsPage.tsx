import { apiClient } from "@/shared/api/apiClient";
import { FormInput } from "@/shared/components/FormInput";
import MainSectionLayout from "@/shared/components/MainSectionLayout";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Item } from "@/shared/components/ui/item";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGroups } from "@/entities/group/model/useGroups";



const GroupsPage = () => {
  return (
    <MainSectionLayout
      pageContent={<PageContent />}
      asideContent={<AsideContent />}
    />
  );
};

export default GroupsPage;
export const Component = GroupsPage;

const PageContent = () => {
  const {
    groups
  } = useGroups();

  return (
    <div className="flex flex-col">
      Groups Page
      <div className="mt-4 flex flex-col gap-2">
        {groups.map((group) => (
          <Link key={group.id} to={`/group/${group.id}`}>
            <Item variant="outline">
              <UserAvatar
                name={group.name}
                imageUrl={group.avatarUrl}
                className="w-10 h-10"
              />
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold">{group.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Subscribers: {group.subscribersCount}
                </p>
              </div>
            </Item>
          </Link>
        ))}
      </div>
    </div>
  );
};

const AsideContent = () => {
  return (
    <Card>
      <CardContent>
        <CreateGroupForm />
      </CardContent>
    </Card>
  );
};

const CreateGroupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be at most 100 characters long"),
});
export type CreateGroupSchema = z.infer<typeof CreateGroupSchema>;

const CreateGroupForm = () => {
  const form = useForm<CreateGroupSchema>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = async (data: CreateGroupSchema) => {
    console.log("Creating group with data:", data);
    await apiClient.post("/groups", data);
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
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="create-group-form">Create</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
