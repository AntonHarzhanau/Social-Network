import { sendMessage } from "@/shared/api/chat";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";

const NewMessageForm = ({ chatId }: { chatId: string }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId || !newMessage.trim()) return;
    await sendMessage(chatId, newMessage);
    setNewMessage("");
  };
  return (
    <form
      id={`new-message-form-${chatId}`}
      onSubmit={handleSendMessage}
      className="flex w-full gap-2 items-center"
    >
      <Input
        name="message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 shadow-sm"
      />
      <Button type="submit" form={`new-message-form-${chatId}`}>
        Send
      </Button>
    </form>
  );
};

export default NewMessageForm;
