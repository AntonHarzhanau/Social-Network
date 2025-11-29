import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";

const ProfilePage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-secondary shadow overflow-hidden">
  {/* Cover */}
  <div className="relative h-32 sm:h-40 bg-linear-to-r from-slate-100 to-amber-200">
    <Button
      variant='secondary'
      size="sm"
      className="absolute right-7 top-7"
    >
      Edit cover
    </Button>

    <Avatar
      className="
        absolute left-4 sm:left-8
        bottom-0 translate-y-1/2
        h-20 w-20 sm:h-28 sm:w-28
        rounded-full border-4 border-white shadow-lg
      "
    >
      <AvatarImage src="" alt="" />
      <AvatarFallback>AH</AvatarFallback>
    </Avatar>
  </div>

  {/* Bottom section */}
  <div
    className="
      flex flex-col sm:flex-row
      justify-between items-start sm:items-center
      gap-3
      px-4 sm:px-8
      pt-12 sm:pt-6 pb-4
    "
  >
    <div className="flex flex-col ml-24 sm:ml-36">
      <h1 className="text-2xl font-bold text-secondary-foreground">
        Антон Горжанов
      </h1>
      <div className="mt-1 text-sm text-muted-foreground">
        Минск · БГУФК · Подробнее
      </div>
    </div>

    <div className="flex gap-2 self-end sm:self-auto">
      <Button size="sm">Edit</Button>
      <Button size="sm">Edit</Button>
    </div>
  </div>
</div>

  );
};

export default ProfilePage;
