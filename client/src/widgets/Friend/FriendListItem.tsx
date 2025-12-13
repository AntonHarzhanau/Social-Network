import { Item, ItemMedia } from "@/shared/components/ui/item";
import { UserAvatar } from "@/shared/components/UserAvatar";
import NewMessageDialog from "../NewMessageDialog";
import { Link } from "react-router-dom";
import DropDownButton from "@/shared/components/DropDownButton";

interface FriendListItemProps {
  user: {
    id: string;
    username: string;
    avatarUrl?: string | null;
  };
}

const FriendListItem = ({ user }: FriendListItemProps) => {
  return (
    <Item
      variant="default"
      key={user.id}
      className="p-4 flex items-center gap-4 hover:bg-muted rounded-2xl"
    >
      <ItemMedia variant="icon" className="w-20 h-20 rounded-full">
        <Link
          to={`/profile/${user.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <UserAvatar
            imageUrl={user.avatarUrl}
            name={user.username}
            className=" rounded-full"
          />
        </Link>
      </ItemMedia>
      <div className="flex flex-col  ">
        <Link
          to={`/profile/${user.id}`}
          className="text-md font-bold hover:underline"
        >
          {user.username}
        </Link>
        <NewMessageDialog
          userId={user.id}
          username={user.username}
          avatarUrl={user.avatarUrl}
        />
      </div>
      <DropDownButton className="ml-auto"/>
    </Item>
  );
};

export default FriendListItem;
