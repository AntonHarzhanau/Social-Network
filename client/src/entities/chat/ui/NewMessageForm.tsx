import { editMessage, sendMessage } from "@/entities/chat/api/chat";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { CircleCheck, CircleX } from "lucide-react";
import { useRef } from "react";
import { useMessageComposer } from "../model/messageComposerContext";

interface NewMessageFormProps {
  chatId: string;
}

const NewMessageForm = ({ chatId }: NewMessageFormProps) => {
  const composer = useMessageComposer();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId) return;

    const text = composer.draft.trim();
    if (!text) return;

    if (composer.mode === "edit") {
      if (!composer.editingMessageId) return;
      await editMessage(composer.editingMessageId, text);
      composer.cancelEdit();
    } else {
      await sendMessage(chatId, text);
      composer.setDraft("");
    }
  };

  return (
    <form
      id={`new-message-form-${chatId}`}
      onSubmit={handleMessage}
      className="flex w-full gap-2 items-center"
    >
      <Input
        ref={inputRef}
        name="message"
        value={composer.draft}
        onChange={(e) => composer.setDraft(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 shadow-sm"
        autoComplete="off"
      />
      {composer.mode === "edit" ? (
        <div className="flex gap-2">
          <button
            type="submit"
            form={`new-message-form-${chatId}`}
            disabled={!composer.draft.trim()}
            onMouseDown={(e) => e.preventDefault()}
          >
            <CircleCheck size={32} className="text-emerald-500" />
          </button>
          <button onClick={() => composer.cancelEdit()}>
            <CircleX size={32} className="text-destructive" />
          </button>
        </div>
      ) : (
        <Button
          type="submit"
          form={`new-message-form-${chatId}`}
          disabled={!composer.draft.trim()}
          onMouseDown={(e) => e.preventDefault()}
        >
          Send
        </Button>
      )}
    </form>
  );
};

export default NewMessageForm;
