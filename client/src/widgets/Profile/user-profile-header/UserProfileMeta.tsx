import { Button } from "@/shared/components/ui/button";
import { GraduationCap, Info, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  userId?: string;
  location?: string | null;
  educationLabel?: string | null;
  workLabel?: string | null;
  canViewMore: boolean;
  onMore: () => void;
};

export function UserProfileMeta({
  userId,
  location,
  educationLabel,
  workLabel,
  canViewMore,
  onMore,
}: Props) {
  return (
    <div className="text-muted-foreground">
      <div className="flex flex-wrap gap-x-4 items-center">
        {location ? (
          <Link to={`/profile/${userId}`} className="inline-flex">
            <div className="flex gap-1 items-center hover:underline">
              <MapPin className="text-foreground h-4 w-4" />
              <p className="text-foreground">{location}</p>
            </div>
          </Link>
        ) : null}

        {educationLabel ? (
          <div className="inline-flex">
            <div className="flex gap-1 items-center">
              <GraduationCap className="text-foreground h-4 w-4" />
              <p className="text-foreground">{educationLabel}</p>
            </div>
          </div>
        ) : null}
        {workLabel ? (
          <div className="inline-flex">
            <div className="flex gap-1 items-center">
              <GraduationCap className="text-foreground h-4 w-4" />
              <p className="text-foreground">{workLabel}</p>
            </div>
          </div>
        ) : null}

        {canViewMore ? (
          <Button
            variant="ghost"
            type="button"
            className="flex gap-1 items-center hover:underline cursor-pointer px-0!"
            onClick={onMore}
          >
            <Info className="text-foreground h-4 w-4" />
            <p className="text-foreground">More</p>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
