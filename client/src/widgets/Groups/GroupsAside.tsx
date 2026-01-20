import CreateGroupForm from "@/features/group/create-group/ui/CreateGroupForm";
import { Card, CardContent } from "@/shared/components/ui/card";
import GroupFilter from "./GroupsFilter";

const GroupsAside = ({
  setMyGroupsOnly,
}: {
  setMyGroupsOnly: (value: boolean) => void;
}) => {
  return (
    <>
      <Card className="mb-4">
        <CardContent>
          <CreateGroupForm />
        </CardContent>
      </Card>
      <GroupFilter setMyGroupsOnly={setMyGroupsOnly} />
    </>
  );
};

export default GroupsAside;
