import MainSectionLayout from "@/shared/components/MainSectionLayout";
import GroupsPageContent from "@/widgets/Groups/GroupsPageContent";
import GroupsWidgets from "@/widgets/Groups/GroupsWidgets";

const GroupsPage = () => {
  return (
    <MainSectionLayout
      pageContent={<GroupsPageContent />}
      asideContent={<GroupsWidgets />}
    />
  );
};

export default GroupsPage;
export const Component = GroupsPage;
