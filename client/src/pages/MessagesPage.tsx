import ChatList from "@/widgets/Chat/ChatList";

const MessagesPage = () => {
  return (
    <div className="h-screen p-4">
      <ChatList />
    </div>
  );
};

export default MessagesPage;
export const Component = MessagesPage;
