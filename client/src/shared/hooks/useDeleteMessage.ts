import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage } from "../api/chat";
import {
  removeMessageFromInfinite,
  type MessagesInfinite,
} from "../lib/messagesCache";

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { chatId: string; messageId: string }) => {
      await deleteMessage(vars.messageId);
    },

    onMutate: async ({ chatId, messageId }) => {
      await queryClient.cancelQueries({ queryKey: ["messages", chatId] });

      const prev = queryClient.getQueryData<MessagesInfinite>([
        "messages",
        chatId,
      ]);

      queryClient.setQueryData<MessagesInfinite>(
        ["messages", chatId],
        (oldData) => removeMessageFromInfinite(oldData, messageId),
      );

      return { prev };
    },

    onError: (_err, { chatId }, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["messages", chatId], context.prev);
      }
    },
  });
};
