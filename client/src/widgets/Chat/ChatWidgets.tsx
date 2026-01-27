import ChatFilter from "@/features/chat/chatFilter/ui/ChatFilter";
import { OpenChatsSidebar } from "@/features/chat/openedChats/ui/OpenChatsSidebar";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface ChatWidgetsProps {
  currentChatId: string;
}

const ChatWidgets = ({ currentChatId }: ChatWidgetsProps) => {
  return (
    <Card className="w-full hidden lg:flex flex-col gap-2 p-4">
      <ChatFilter />
      <Separator className="min-h-px bg-accent-foreground/10" />
      <OpenChatsSidebar currentChatId={currentChatId} />
    </Card>
  );
};

export default ChatWidgets;
