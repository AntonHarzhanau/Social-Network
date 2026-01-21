import { useGroup } from "@/entities/group/model/useGroup";
import { sessionStore } from "@/entities/session/model/sessionStore";
import MainSectionLayout from "@/shared/components/MainSectionLayout";
import GroupAside from "@/widgets/Group/GroupAside";
import GroupHeader from "@/widgets/Group/GroupHeader";
import GroupPageContent from "@/widgets/Group/GroupPageContent";
import { MembersList } from "@/widgets/Group/MembersList";
import { useParams } from "react-router-dom";

const GroupPage = () => {
  const user = sessionStore((s) => s.user);
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading, error } = useGroup(groupId!);

  return (
    <div>
      <GroupHeader group={group} />
      <MainSectionLayout
        pageContent={<GroupPageContent group={group} />}
        asideContent={
          <>
            {(group?.role === "owner" || group?.role === "admin") && (
              <MembersList
                groupId={group.id}
                myRole={group.role}
                myUserId={user?.id ?? ""}
              />
            )}
            <GroupAside groupId={groupId} />
          </>
        }
      />
    </div>
  );
};

export default GroupPage;
export const Component = GroupPage;
