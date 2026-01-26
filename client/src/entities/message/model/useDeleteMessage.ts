import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage } from "@/entities/chat/api/chat";
import { messageKeys } from "@/entities/message/model/queryKeys";

import {
  removeMessageFromInfinite,
  type MessagesInfinite,
} from "@/shared/lib/messagesCache";

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { chatId: string; messageId: string }) => {
      await deleteMessage(vars.messageId);
    },

    onMutate: async ({ chatId, messageId }) => {
      await queryClient.cancelQueries({ queryKey: messageKeys.list(chatId) });

      const prev = queryClient.getQueryData<MessagesInfinite>(
        messageKeys.list(chatId),
      );

      queryClient.setQueryData<MessagesInfinite>(
        messageKeys.list(chatId),
        (oldData) => removeMessageFromInfinite(oldData, messageId),
      );

      return { prev };
    },

    onError: (_err, { chatId }, context) => {
      if (context?.prev) {
        queryClient.setQueryData(messageKeys.list(chatId), context.prev);
      }
    },
  });
};
