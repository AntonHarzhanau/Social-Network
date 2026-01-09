import { useGroup } from "@/entities/group/model/useGroup";
import ProfileHeader from "@/shared/components/ProfileHeader";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useParams } from "react-router-dom";

const GroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading, error } = useGroup(groupId!);

  return (
    <div>
      <ProfileHeader
        title={
          <h1 className="text-2xl font-bold text-secondary-foreground">
            {group?.name}
          </h1>
        }
        avatar={
          <UserAvatar
            imageUrl={group?.avatarUrl}
            name={group?.name}
            className="
              h-32 w-32 sm:h-36 sm:w-36
              rounded-full border-4 shadow-lg
            "
          />
        }
        meta={
          <div className=" text-sm text-muted-foreground">
            {group?.subscribersCount}
          </div>
        }
      />
    </div>
  );
};

export default GroupPage;
export const Component = GroupPage;
