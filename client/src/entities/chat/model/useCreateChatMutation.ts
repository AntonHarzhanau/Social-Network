import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChat, type CreateChatPayload } from "../api/chat";
import { chatKeys } from "./queryKeys";

export function useCreateChatMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChatPayload) => createChat(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}
