import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const HeaderAvatar = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer p-5 hover:bg-accent/80"
    >
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </Button>
  );
};

export default HeaderAvatar;
