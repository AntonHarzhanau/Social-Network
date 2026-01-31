import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { Post } from "./types";
import { postKeys } from "./queryKeys";
import { replacePostInInfinite } from "./postCache";
import { insertPostIntoCachedLists } from "./postCache";
import { postApi } from "../api/postApi";

export async function syncPostByIdInCache(
  qc: QueryClient,
  postId: string,
): Promise<Post> {
  const fresh = await qc.fetchQuery<Post>({
    queryKey: postKeys.detail(postId),
    queryFn: () => {
      return postApi.fetchPostById(postId);
    },
  });

  qc.setQueryData<Post>(postKeys.detail(postId), fresh);

  qc.setQueriesData<InfiniteData<Post[]>>(
    { queryKey: postKeys.lists() },
    (old) => replacePostInInfinite(old, postId, fresh),
  );

  return fresh;
}

export async function fetchAndInsertCreatedPost(
  qc: QueryClient,
  postId: string,
): Promise<Post> {
  const fresh = await qc.fetchQuery<Post>({
    queryKey: postKeys.detail(postId),
    queryFn: () => postApi.fetchPostById(postId),
  });

  qc.setQueryData<Post>(postKeys.detail(postId), fresh);
  insertPostIntoCachedLists(qc, fresh);

  return fresh;
}
