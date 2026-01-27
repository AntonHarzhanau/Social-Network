import { useOpenedChatsStore } from "../model/openedChatsStore";
import { OpenChatRow } from "./OpenChatRow";

export function OpenChatsSidebar(props: { currentChatId: string }) {
  const openedIds = useOpenedChatsStore((s) => s.openedIds);

  if (!openedIds.length) return null;

  return (
    <div className="flex flex-col gap-2">
      {openedIds.map((chatId) => (
        <OpenChatRow
          key={chatId}
          chatId={chatId}
          active={props.currentChatId === chatId}
          currentChatId={props.currentChatId}
        />
      ))}
    </div>
  );
}
