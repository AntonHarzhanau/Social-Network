import { useQuery } from "@tanstack/react-query";
import { fetchPosts, type FetchPostsParams, type Post } from "../api/postApi";

export const usePosts = ({ page = 1, limit = 10 }: FetchPostsParams) => {
  return useQuery<Post[]>({
    queryKey: ["posts", page, limit],
    queryFn: () => fetchPosts({ page, limit }),
  });
};
