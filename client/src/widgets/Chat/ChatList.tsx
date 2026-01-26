// import { useEffect, useRef } from "react";
// import ChatListItem from "@/entities/chat/ui/ChatListItem";
// import { useInfiniteChats } from "@/entities/chat/model/useChat";
// import { Card } from "@/shared/components/ui/card";

// const ChatList = () => {
//   const { data, fetchNextPage, hasNextPage, status } =
//     useInfiniteChats();

//   const loadMoreRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!hasNextPage) return;

//     const target = loadMoreRef.current;
//     if (!target) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const [entry] = entries;
//         if (entry.isIntersecting) {
//           fetchNextPage();
//         }
//       },
//       { threshold: 1 },
//     );
//     observer.observe(target);

//     return () => {
//       observer.disconnect();
//     };
//   }, [fetchNextPage, hasNextPage]);

//   if (status === "pending") {
//     return <div>Loading...</div>;
//   }

//   if (status === "error") {
//     return <div>Failed to load chats.</div>;
//   }

//   const chats = data?.pages.flat() ?? [];

//   return (
//     <Card className="p-1 gap-0 h-full overflow-y-auto">
//       {chats.map((chat) => (
//         <ChatListItem key={chat.id} chat={chat} />
//       ))}
//       <div ref={loadMoreRef} />
//     </Card>
//   );
// };

// export default ChatList;
