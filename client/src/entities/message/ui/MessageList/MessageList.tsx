// import type { Message } from "@/entities/chat/model/types";
// import { useChatUiStore } from "@/entities/chat/model/chatUiStore";
// import { MessageListControls } from "./MessageListControls";
// import { useMessageListController } from "./useMessageListController";
// import MessageItem from "../MessageItem";

// interface MessageListProps {
//   chatId: string;
//   messages: Message[];
//   currentUserId?: string;
//   onLoadMore?: () => Promise<void> | void;
//   hasMore?: boolean;
// }

// const MessageList = ({
//   chatId,
//   messages,
//   currentUserId,
//   onLoadMore,
//   hasMore,
// }: MessageListProps) => {
//   const cursorId = useChatUiStore((s) => s.cursorByChat[chatId] ?? null);
//   const setCursor = useChatUiStore((s) => s.setCursor);

//   const { containerRef, bottomRef, isAtBottom, hasUnread, scrollToBottom } =
//     useMessageListController({
//       chatId,
//       messages,
//       cursorId,
//       setCursor,
//       onLoadMore,
//       hasMore,
//     });

//   return (
//     <div className="relative h-[65vh] w-full">
//       <div ref={containerRef} className="h-full w-full overflow-y-auto p-0">
//         <>
//           {messages.map((message) => (
//             <MessageItem
//               key={message.id}
//               chatId={chatId}
//               message={message}
//               currentUserId={currentUserId}
//             />
//           ))}
//           <div ref={bottomRef} />
//         </>

//         <MessageListControls
//           isAtBottom={isAtBottom}
//           hasUnread={hasUnread}
//           onScrollToBottom={scrollToBottom}
//         />
//       </div>
//     </div>
//   );
// };

// export default MessageList;
