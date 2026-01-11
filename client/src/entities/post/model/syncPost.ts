import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { Post } from "./types";
import { postKeys } from "./queryKeys";
import { replacePostInInfinite } from "./postCache";
import { insertPostIntoCachedLists } from "./postCache";
import { postApi } from "../api/postApi";

/**
* 1) fetch post by id
* 2) put it in the detail cache
* 3) replace it in all infinite lists where it already exists
*/
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

/**
* For create: the post is new – it's not in the lists, so:
* 1) fetchPostById
* 2) insert into the already cached lists (general + by author)
*/
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
