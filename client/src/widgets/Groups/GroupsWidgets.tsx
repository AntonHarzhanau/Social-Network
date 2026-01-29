import CreateGroupForm from "@/features/group/create-group/ui/CreateGroupForm";
import GroupFilter from "@/features/group/filter-group/ui/GroupFilter";

const GroupsWidgets = () => {
  return (
    <aside>
      <CreateGroupForm />
      <GroupFilter />
    </aside>
  );
};

export default GroupsWidgets;
