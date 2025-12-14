<?php

namespace App\Factory\Post;

use App\DTO\Post\CreatePostDTO;
use App\DTO\Post\PostFeedItemDTO;
use App\Entity\Post;
use App\Entity\PostMediaBinding;
use App\Factory\Media\MediaFactory;
use App\Factory\User\UserFactory;
use App\Modules\Identity\Domain\Entity\User;
use App\Service\Media\MediaUrlGeneratorInterface;

class PostFactory
{
    public function __construct(
        private readonly UserFactory $userFactory,
        private readonly MediaFactory $mediaFactory,
        private readonly MediaUrlGeneratorInterface $mediaUrlGenerator,
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
                $mediaDTOs[] = $this->mediaFactory->toResponseDTO($media, $this->mediaUrlGenerator->getPublicUrl($media));
            }
        }
        return new PostFeedItemDTO(
            id: $post->getId(),
            author: $this->userFactory->toUserResponseDTO($post->getAuthor()),
            content: $post->getContent(),
            date: $post->getCreatedAt(),
            likeCount: $post->getLikeCount(),
            commentCount: $post->getCommentCount(),
            isLikedByCurrentUser: $isLikedByCurrentUser,
            media: $mediaDTOs,
        );
    }
}
