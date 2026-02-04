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
import { Avatar } from "@/shared/components/Avatar";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { chatQueryKeys } from "@/entities/chat/model/chatQueryKeys";

interface NewMessageDialogProps {
  userId: string;
  username: string;
  avatarUrl?: string | null;
  type?: "default" | "link";
}

const NewMessageDialog = ({
  userId,
  username,
  avatarUrl,
  type = "link",

}: NewMessageDialogProps) => {
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting new message to user:", userId, newMessage);
    if (!userId || !newMessage.trim()) return;
    try {
      await createDirectChat({
        participantId: userId,
        content: newMessage,
      });
      toast.success("Message sent!");
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.all });
      navigate(`/chats`);

    } catch (error) {
      toast.error("Failed to send message.");
      console.error("Error creating direct chat:", error);
    }


  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit} id={`new-message-form-${userId}`}>
        <DialogTrigger asChild>
          <Button variant={type} className="text-xs font-normal">
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
              <Avatar
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
