import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SendMode = "new" | "edit";

type ComposerState = {
  mode: SendMode;
  editingMessageId: string | null;
  draft: string;

  startEdit: (messageId: string, initialContent: string) => void;
  cancelEdit: () => void;
  setDraft: (content: string) => void;
};

const MessageComposerContext = createContext<ComposerState | null>(null);

export function MessageComposerProvider(props: { children: ReactNode }) {
  const [mode, setMode] = useState<SendMode>("new");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const [draft, setDraft] = useState<string>("");

  const startEdit = useCallback((messageId: string, initialContent: string) => {
    setMode("edit");
    setEditingMessageId(messageId);
    setDraft(initialContent);
  }, []);

  const cancelEdit = useCallback(() => {
    setMode("new");
    setEditingMessageId(null);
    setDraft("");
  }, []);

  const value = useMemo(
    () => ({
      mode,
      editingMessageId,
      draft,
      startEdit,
      cancelEdit,
      setDraft,
    }),
    [mode, editingMessageId, draft, startEdit, cancelEdit],
  );
  return (
    <MessageComposerContext.Provider value={value}>
      {props.children}
    </MessageComposerContext.Provider>
  );
}

export function useMessageComposer() {
  const context = useContext(MessageComposerContext);
  if (!context) {
    throw new Error(
      "useMessageComposer must be used within a MessageComposerProvider",
    );
  }
  return context;
}
