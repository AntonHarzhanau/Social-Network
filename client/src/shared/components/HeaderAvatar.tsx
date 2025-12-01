import { Button } from "./ui/button";
import { UserAvatar } from "./UserAvatar";



const HeaderAvatar = ({name, imageId}: {name: string, imageId?: string | null}) => {
    console.log("HeaderAvatar", imageId, name);
    console.log("HeaderAvatar render:");
  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer p-5 hover:bg-accent/80"
    >
      <UserAvatar imageId={imageId} name={name} />
    </Button>
  );
};

export default HeaderAvatar;
