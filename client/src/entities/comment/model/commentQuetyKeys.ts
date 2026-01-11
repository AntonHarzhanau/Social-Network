export const COMMENT_QUERY_KEY = "comments" as const;

export const commentsKey = (threadId: string) =>
  [COMMENT_QUERY_KEY, threadId] as const;


export const commentRepliesKey = (commentId: string) =>
  ["commentReplies", commentId] as const;
