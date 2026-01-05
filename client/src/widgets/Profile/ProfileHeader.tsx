import { Button } from "@/shared/components/ui/button";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { BriefcaseBusiness, GraduationCap, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AvatarCropDialog } from "../AvatarCropDialog";
import { uploadMedia } from "@/shared/api/media";
import { uploadAvatar } from "@/entities/user/api/userApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const ProfileHeader = ({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string | null;
}) => {
  const [open, setOpen] = useState(false);

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

        <DropdownMenu>
          <DropdownMenuTrigger
            className="absolute left-4 sm:left-6 -bottom-4 translate-y-1/2 border-none focus:ring-0"
          >
              <UserAvatar
                imageUrl={avatarUrl}
                name={name}
                className="
              h-32 w-32 sm:h-36 sm:w-36
              rounded-full border-4 shadow-lg
              cursor-pointer
            "
              />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Open photo</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>Upload photo</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete photo</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            <Button size="sm" className="">
              Edit profile
            </Button>
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
      <AvatarCropDialog
        open={open}
        onOpenChange={setOpen}
        onSaved={async ({ original, preview }) => {
          const originalRes = await uploadMedia(original);
          const previewRes = await uploadMedia(preview);

          console.log("Uploading avatar with ids:", {
            originalRes,
            previewRes,
          });
          await uploadAvatar(originalRes.id, previewRes.id);
        }}
      />
    </div>
  );
};

export default ProfileHeader;
