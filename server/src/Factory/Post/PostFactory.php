<?php

namespace App\Factory\Post;

use App\DTO\Post\CreatePostDTO;
use App\DTO\Post\PostAuthorDTO;
use App\DTO\Post\PostFeedItemDTO;
use App\DTO\Post\PostMediaDTO;
use App\Entity\Post;
use App\Entity\PostMediaBinding;
use App\Entity\User;

class PostFactory
{
    public function __construct(

    ) {}
    
    public function createPostFromDTO(CreatePostDTO $dto, User $author, array $media): Post
    {
        $post = new Post();
        $post->setAuthor($author);
        $post->setContent($dto->content);
        if ($dto->visibility !== null) {
            $post->setVisibility($dto->visibility);
        }
        foreach ($media as $mediaAsset) {
            $binding = new PostMediaBinding();
            $binding->setPost($post);
            $binding->setMedia($mediaAsset);
            $post->addBindedMedia($binding);
        }
        return $post;
    }

    public static function mapPostToPostFeedItemDTO(Post $post, array $likedMap): PostFeedItemDTO
    {
        $postId = (string) $post->getId();
        $author = $post->getAuthor();
        $date = $post->getUpdatedAt() ?? $post->getCreatedAt();
        
        $mediaDTOs = [];
        foreach ($post->getBindedMedia() as $binding) {
            $media = $binding->getMedia();
            $mediaDTOs[] = new PostMediaDTO(
                id: (string) $media->getId(),
                url: $media->getStorageKey(),
                type: $media->getFileType()->value ?? null,
            );
        }

        return new PostFeedItemDTO(
            id: (string) $post->getId(),
            content: $post->getContent(),
            date: $date,
            likeCount: $post->getLikeCount(),
            commentCount: $post->getCommentCount(),
            isLikedByCurrentUser: $likedMap[$postId] ?? false,
            author: new PostAuthorDTO(
                id: (string) $author->getId(),
                username: $author->getUsername(),
                avatarUrl: $author->getAvatarUrl(),
            ),
            media: $mediaDTOs,
        );
    }
}
