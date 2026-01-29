import { useGroup } from "@/entities/group/model/useGroup";
import MainSectionLayout from "@/shared/components/MainSectionLayout";
import GroupAside from "@/widgets/Group/GroupAside";
import GroupHeader from "@/widgets/Group/GroupHeader";
import GroupPageContent from "@/widgets/Group/GroupPageContent";
import { useParams } from "react-router-dom";

const GroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading, error } = useGroup(groupId!);

  if (isLoading || !group) {
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div>
      <GroupHeader group={group} />
      <MainSectionLayout
        pageContent={<GroupPageContent group={group} />}
        asideContent={<GroupAside group={group} />}
      />
    </div>
  );
};

export default GroupPage;
export const Component = GroupPage;
