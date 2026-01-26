import { sendMessage } from "@/entities/chat/api/chat";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useRef, useState } from "react";

const NewMessageForm = ({
  chatId,
  onBeforeSend,
}: {
  chatId: string;
  onBeforeSend?: () => void;
}) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId) return;

    const text = message.trim();
    if (!text || sending) return;

    onBeforeSend?.();

    try {
      setSending(true);
      await sendMessage(chatId, text);
      setMessage("");

      queueMicrotask(() => inputRef.current?.focus());
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      id={`new-message-form-${chatId}`}
      onSubmit={handleSendMessage}
      className="flex w-full gap-2 items-center"
    >
      <Input
        ref={inputRef}
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 shadow-sm"
        autoComplete="off"
      />
      <Button
        type="submit"
        form={`new-message-form-${chatId}`}
        disabled={sending || !message.trim()}
        onMouseDown={(e) => e.preventDefault()}
      >
        Send
      </Button>
    </form>
  );
};

export default NewMessageForm;
