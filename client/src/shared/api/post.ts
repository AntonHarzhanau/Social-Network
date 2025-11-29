import { apiClient } from "./apiClient";

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';

export interface Author {
    id: string;
    username: string;
    avatarUrl: string;
}

export interface PostMedia {
    id: string;
    url: string;
    type: MediaType;
}

export interface Post {
    id: string;
    author: Author;
    content: string;
    date: string;
    likeCount: number;
    commentCount: number;
    isLikedByCurrentUser: boolean;
    media: PostMedia[];
        
}

export interface PostsResponse {
  posts: Post[];
}

export const fetchPosts = async (): Promise<Post[]> => {
    const page = 1;
    const limit = 10;
    const response = await apiClient.get<PostsResponse>(`/posts?page=${page}&limit=${limit}`);

    return response.data.posts;
}
