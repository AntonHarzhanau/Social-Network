import { Button } from "@/shared/components/ui/button";
import { useUserProfile } from "@/entities/user/model/useUserProfile";
import EditProfileForm from "@/entities/user/ui/EditProfileForm";
import ProfileHeader from "@/shared/components/ProfileHeader";
import UserProfileAvatar from "@/features/user/manage-avatar/ui/UserProfileAvatar";
import { Link } from "react-router-dom";
import { GraduationCap, Info, MapPin } from "lucide-react";
import { sessionUser } from "@/entities/session/model/sessionStore";

interface UserProfileHeaderProps {
  userId?: string;
}

const UserProfileHeader = ({ userId }: UserProfileHeaderProps) => {
  const user =  sessionUser();
  const { data: userProfile } = useUserProfile(userId);

  const isOwner = !!userId && user?.id === userId;

  return (
    <>
      <ProfileHeader
        coverAction={
          isOwner ? (
            <Button variant="secondary" size="sm">
              Edit cover
            </Button>
          ) : null
        }
        avatar={
          <UserProfileAvatar
            userId={userId}
            avatarUrl={userProfile?.avatarUrl}
            username={userProfile?.username}
            isOwner={isOwner}
          />
        }
        title={
          <h1 className="text-2xl font-bold text-secondary-foreground">
            {userProfile?.username || ""}
          </h1>
        }
        rightActions={
          isOwner ? (
            <EditProfileForm profileData={userProfile} userId={userId} />
          ) : null
        }
        meta={
          <div className=" text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-3">
              <Link to="/profile">
                {userProfile?.location && (
                  <div className="flex gap-1 items-center hover:underline">
                    <MapPin className="text-foreground h-4 w-4" />
                    <p className="text-foreground">{userProfile?.location}</p>
                  </div>
                )}
              </Link>

              <Link to="/profile">
                <div className="flex gap-1 items-center hover:underline">
                  <GraduationCap className="text-foreground h-4 w-4" />
                  <p className="text-foreground">Ynov Campus Strasbourg</p>
                </div>
              </Link>

              <div className="flex gap-1 items-center hover:underline">
                <Info className="text-foreground h-4 w-4" />
                <p className="text-foreground">More</p>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};

export default UserProfileHeader;
