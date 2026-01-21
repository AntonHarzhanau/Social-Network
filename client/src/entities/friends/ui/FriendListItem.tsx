import { Item, ItemMedia } from "@/shared/components/ui/item";
import { Avatar } from "@/shared/components/Avatar";
import NewMessageDialog from "../../../widgets/NewMessageDialog";
import { Link } from "react-router-dom";
import type { UserPreview } from "@/entities/user/model/types";
import { Button } from "@/shared/components/ui/button";

import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useRemoveFriendMutation,
  useSendFriendRequestMutation,
} from "@/entities/friends/model/useFriendMutation";

interface FriendListItemProps {
  user: UserPreview;
  filter?: string;
}

const FriendListItem = ({ user, filter }: FriendListItemProps) => {
  const sendMutation = useSendFriendRequestMutation();
  const cancelMutation = useCancelFriendRequestMutation();
  const acceptMutation = useAcceptFriendRequestMutation();
  const declineMutation = useDeclineFriendRequestMutation();
  const removeMutation = useRemoveFriendMutation();

  const isBusy =
    sendMutation.isPending ||
    cancelMutation.isPending ||
    acceptMutation.isPending ||
    declineMutation.isPending ||
    removeMutation.isPending;

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
          <Avatar
            imageUrl={user.avatarUrl}
            name={user.name}
            className=" rounded-full"
          />
        </Link>
      </ItemMedia>
      <div className="flex flex-col  ">
        <Link
          to={`/profile/${user.id}`}
          className="text-md font-bold hover:underline"
        >
          {user.name}
        </Link>
        <NewMessageDialog
          userId={user.id}
          username={user.name}
          avatarUrl={user.avatarUrl}
        />
      </div>
      {filter === "received" && (
        <div className="ml-auto flex gap-2">
          <Button
            disabled={isBusy}
            onClick={() => acceptMutation.mutate(user.id)}
          >
            {acceptMutation.isPending ? "Accepting..." : "Accept"}
          </Button>
          <Button
            variant="outline"
            disabled={isBusy}
            onClick={() => declineMutation.mutate(user.id)}
          >
            {declineMutation.isPending ? "Rejecting..." : "Reject"}
          </Button>
        </div>
      )}

      {filter === "sent" && (
        <div className="ml-auto">
          <Button
            variant="outline"
            disabled={isBusy}
            onClick={() => cancelMutation.mutate(user.id)}
          >
            {cancelMutation.isPending ? "Canceling..." : "Cancel Request"}
          </Button>
        </div>
      )}

      {filter === "" && (
        <div className="ml-auto">
          <Button
            disabled={isBusy}
            onClick={() => sendMutation.mutate(user.id)}
          >
            {sendMutation.isPending ? "Sending..." : "Add to Friends"}
          </Button>
        </div>
      )}

      {filter === "all" && (
        <div className="ml-auto">
          <Button
            variant="outline"
            disabled={isBusy}
            onClick={() => removeMutation.mutate(user.id)}
          >
            {removeMutation.isPending ? "Removing..." : "Remove from Friends"}
          </Button>
        </div>
      )}

      {/* Ошибки (опционально) */}
      {(sendMutation.isError ||
        cancelMutation.isError ||
        acceptMutation.isError ||
        declineMutation.isError ||
        removeMutation.isError) && (
        <div className="text-xs text-destructive ml-auto">Action failed</div>
      )}
    </Item>
  );
};

export default FriendListItem;
