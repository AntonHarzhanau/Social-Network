// import { useRef } from "react";

// import { Card, CardAction, CardContent } from "@/shared/components/ui/card";
// import { Avatar } from "@/shared/components/Avatar";

// import { sessionUser } from "@/entities/session/model/sessionStore";

// interface MessagesPageProps {
//   chatId: string;
// }

// const Chat = ({ chatId }: MessagesPageProps) => {
//   const currentUserId = sessionUser()?.id;

//   return (
//     <Card className="flex flex-col gap-2 py-4 px-2">
//       <div className="flex items-center gap-3 p-2 border-b">
//         <Avatar
//           imageUrl={chat?.avatarUrl}
//           name={chat?.title ?? "Chat"}
//           className="w-12 h-12"
//         />
//         <h2 className="text-lg font-semibold">{chat?.title ?? "Chat"}</h2>
//       </div>

//       <CardContent className="flex flex-col gap-2 p-0">
//         {isFetchingNextPage && (
//           <div className="text-center text-xs text-muted-foreground">
//             Loading messages…
//           </div>
//         )}

//         <MessageList
//           chatId={chatId}
//           messages={messages}
//           currentUserId={currentUserId}
//           lastReadMessageId={lastReadMessageId}
//           onReadProgress={markReadUpTo}
//           hasMore={hasNextPage}
//           onLoadMore={() => {
//             if (hasNextPage && !isFetchingNextPage) {
//               fetchNextPage();
//             }
//           }}
//         />
//       </CardContent>

//       <CardAction className="w-full shadow-t-md pt-2 border-t">
//         <NewMessageForm chatId={chatId} />
//       </CardAction>
//     </Card>
//   );
// };

// export default Chat;
