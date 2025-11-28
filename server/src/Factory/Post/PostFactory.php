<?php

namespace App\Factory\Post;

use App\DTO\Post\CreatePostDTO;
use App\DTO\Post\PostFeedItemDTO;
use App\DTO\Post\PostMediaDTO;
use App\Entity\Post;
use App\Entity\PostMediaBinding;
use App\Entity\User;
use App\Factory\User\UserFactory;

class PostFactory
{
    public function __construct(
        private readonly UserFactory $userFactory,
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

    public function mapPostToPostFeedItemDTO(Post $post, bool $isLikedByCurrentUser): PostFeedItemDTO
    {
        $mediaDTOs = [];
        foreach ($post->getBindedMedia() as $binding) {
            $media = $binding->getMedia();
            if ($media) {
                $mediaDTOs[] = new PostMediaDTO(
                    id: $media->getId(),
                    url: $media->getStorageKey(),
                    type: $media->getFileType(),
                );
            }
        }
        return new PostFeedItemDTO(
            id: $post->getId(),
            author: $this->userFactory->toAuthorSummaryDTO($post->getAuthor()),
            content: $post->getContent(),
            date: $post->getCreatedAt(),
            likeCount: $post->getLikeCount(),
            commentCount: $post->getCommentCount(),
            isLikedByCurrentUser: $isLikedByCurrentUser,
            media: $mediaDTOs,
        );
    }
}
