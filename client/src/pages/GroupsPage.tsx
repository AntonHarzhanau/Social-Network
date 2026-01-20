import MainSectionLayout from "@/shared/components/MainSectionLayout";
import GroupsPageContent from "@/widgets/Groups/GroupsPageContent";
import GroupsAside from "@/widgets/Groups/GroupsAside";
import { useState } from "react";

const GroupsPage = () => {
  const [myGroupsOnly, setMyGroupsOnly] = useState(false);

  return (
    <>
      <MainSectionLayout
        pageContent={<GroupsPageContent myGroupsOnly={myGroupsOnly} />}
        asideContent={<GroupsAside setMyGroupsOnly={setMyGroupsOnly} />}
      />
    </>
  );
};

export default GroupsPage;
export const Component = GroupsPage;
