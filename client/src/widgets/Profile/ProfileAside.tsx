import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardTitle } from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/constants/routes";
import { Link } from "react-router-dom";

const ProfileAside = () => {
  return (
    <div>
      <Card className="h-56 p-3">
        <CardTitle>
          <div className="flex items-baseline gap-2">
            <Link to={ROUTES.FRIENDS} className="text-sm font-medium hover:underline">
              Friends
            </Link>
            <p className="text-xs text-muted-foreground">177</p>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" alt="Friend Avatar" />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <p className="text-xs font-light">Anton</p>
              </div>
            ))}
          </div>
        </CardTitle>
      </Card>
    </div>
  );
};

export default ProfileAside;
