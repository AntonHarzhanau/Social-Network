import { ChatWindow } from "./ChatWindow";

const MessagesPage = () => {
  const chatId = "uuid-чата";
  const currentUserId = "uuid-текущего-пользователя";
  return (
    <div className="h-screen p-4">
      <ChatWindow chatId={chatId} currentUserId={currentUserId} />
    </div>
  );
};

export default MessagesPage;
export const Component = MessagesPage;
