import { Button } from "@/shared/components/ui/button";
import EditProfileForm from "@/entities/user/ui/EditProfileForm";
import ProfileHeader from "@/shared/components/ProfileHeader";
import UserProfileAvatar from "@/features/user/manage-avatar/ui/UserProfileAvatar";
import { Link } from "react-router-dom";
import { GraduationCap, Info, MapPin } from "lucide-react";
import { sessionStore } from "@/entities/session/model/sessionStore";
import type { UserProfile } from "@/entities/user/model/types";

interface UserProfileHeaderProps {
  user?: UserProfile;
  loading: boolean;
}

const UserProfileHeader = ({ user, loading }: UserProfileHeaderProps) => {
  const currentUser = sessionStore((s) => s.user);
  const isOwner = !!user?.id && user?.id === currentUser?.id;

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
            userId={user?.id}
            avatarUrl={user?.avatarUrl}
            name={user?.name}
            isOwner={isOwner}
          />
        }
        title={
          <h1 className="text-2xl font-bold text-secondary-foreground">
            {user?.name || ""}
          </h1>
        }
        rightActions={
          isOwner ? (
            <EditProfileForm profileData={user} userId={user?.id} />
          ) : null
        }
        meta={
          <div className=" text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-3">
              <Link to="/profile">
                {user?.location && (
                  <div className="flex gap-1 items-center hover:underline">
                    <MapPin className="text-foreground h-4 w-4" />
                    <p className="text-foreground">{user?.location}</p>
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
