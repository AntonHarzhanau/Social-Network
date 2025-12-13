import { Button } from "@/shared/components/ui/button";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { BriefcaseBusiness, GraduationCap, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileHeader = ({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string | null;
}) => {
  return (
    <div className="w-full  mx-auto rounded-2xl bg-secondary shadow overflow-hidden">
      {/* Cover */}
      <div className="relative h-32 sm:h-40 bg-linear-to-r from-slate-100 to-amber-200">
        <Button
          variant="secondary"
          size="sm"
          className="absolute right-7 top-7"
        >
          Edit cover
        </Button>

        <UserAvatar
          imageUrl={avatarUrl}
          name={name}
          className="
        absolute left-4 sm:left-6
        -bottom-4 translate-y-1/2
        h-32 w-32 sm:h-36 sm:w-36
        rounded-full border-4 shadow-lg
      "
        />
      </div>

      {/* Bottom section */}
      <div
        className="
      flex flex-col sm:flex-row
      justify-between items-start sm:items-center
      gap-3
      ml-34 sm:ml-40
      px-2 sm:px-4
      pt-8 sm:pt-4 pb-4
    "
      >
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-bold text-secondary-foreground">
              {name}
            </h1>
            <Button size="sm" className="">Edit profile</Button>
          </div>

          <div className=" text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-3">
              <Link to="/profile">
                <Button
                  variant="link"
                  className="px-0"
                  style={{ paddingInline: 0 }}
                >
                  <div className="flex gap-1 items-center">
                    <MapPin />
                    Minsk
                  </div>
                </Button>
              </Link>

              <Link to="/profile">
                <Button
                  variant="link"
                  className="px-0"
                  style={{ paddingInline: 0 }}
                >
                  <div className="flex gap-1 items-center">
                    <GraduationCap />
                    Ynov Campus Strasbourg
                  </div>
                </Button>
              </Link>

              <Button
                variant="link"
                className="px-0"
                style={{ paddingInline: 0 }}
              >
                <div className="flex gap-1 items-center">
                  <BriefcaseBusiness />
                  Software Engineers
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
