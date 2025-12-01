import { Button } from "@/shared/components/ui/button";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { BriefcaseBusiness, GraduationCap, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileHeader = ({
  name,
  imageId,
}: {
  name: string;
  imageId?: string | null;
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
          imageId={imageId}
          name={name}
          className="
        absolute left-4 sm:left-6
        -bottom-4 translate-y-1/2
        h-20 w-20 sm:h-28 sm:w-28
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
      ml-28
      px-4 sm:px-8
      pt-12 sm:pt-6 pb-4
    "
      >
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-secondary-foreground">
              {name}
            </h1>
            <div className="flex gap-2">
              <Button size="sm">Edit profile</Button>
            </div>
          </div>

          <div className=" text-sm text-muted-foreground">
            <div className="flex gap-4">
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
