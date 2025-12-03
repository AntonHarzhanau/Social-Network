import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
// import { UserAvatar } from "./UserAvatar";
import { getInitials } from "../lib/getInitials";

const HeaderAvatar = ({
  name,
  imageId,
}: {
  name: string;
  imageId?: string | null;
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer p-5 hover:bg-accent/80"
    >
        <Avatar className="h-8 w-8">
            <AvatarImage src={imageId ?? undefined} alt={name} className="object-bottom-r" />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
      {/* <UserAvatar imageId={imageId} name={name} /> */}
    </Button>
  );
};

export default HeaderAvatar;
