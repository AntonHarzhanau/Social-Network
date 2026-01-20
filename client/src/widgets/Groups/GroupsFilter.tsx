import { Card, CardContent } from "@/shared/components/ui/card";

const GroupFilter = ({
  setMyGroupsOnly,
}: {
  setMyGroupsOnly: (value: boolean) => void;
}) => {
  return (
    <Card>
      <CardContent className="">
        <div onClick={() => setMyGroupsOnly(false)}>All</div>
        <div onClick={() => setMyGroupsOnly(true)}>My Groups</div>
      </CardContent>
    </Card>
  );
};

export default GroupFilter;
