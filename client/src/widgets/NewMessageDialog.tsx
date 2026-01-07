import { createDirectChat } from "@/entities/chat/api/chat";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

interface NewMessageDialogProps {
  userId: string;
  username: string;
  avatarUrl?: string | null;
}

const NewMessageDialog = ({
  userId,
  username,
  avatarUrl,
}: NewMessageDialogProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting new message to user:", userId, newMessage);
    if (!userId || !newMessage.trim()) return;
    await createDirectChat({
      participantId: userId,
      content: newMessage,
    });
    setNewMessage("");
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit} id={`new-message-form-${userId}`}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-xs font-normal p-0">
            <div className="flex gap-1">
              <MessageCircle className="" />
              <p>New Message</p>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New message</DialogTitle>
            <div className="flex items-center gap-4 mt-4">
              <UserAvatar
                imageUrl={avatarUrl}
                alt={username}
                name={username}
                className="w-10 h-10"
              />
              <h2>{username}</h2>
            </div>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Your message..."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form={`new-message-form-${userId}`}>
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default NewMessageDialog;
