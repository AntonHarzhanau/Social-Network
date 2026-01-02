<?php

namespace App\Modules\Feed\Application\Service;

use App\Modules\Feed\Application\DTO\PostFeedItem;
use App\Modules\Feed\Application\DTO\PostFeedRowDTO;
use App\Modules\Feed\Application\Port\MediaAssetDirectoryInterface;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;

class PostFactory
{
    public function __construct(
        private readonly MediaAssetDirectoryInterface $mediaAssetDirectory,
        private readonly UserDirectoryInterface $userDirectory,
    ) {}

    public function toPostResponse(PostFeedRowDTO $dto, $author = null, array $postMedia = []): PostFeedItem
    {
        return new PostFeedItem(
            id: $dto->id,
            content: $dto->content,
            likeCount: $dto->likeCount,
            commentCount: $dto->commentCount,
            isLikedByCurrentUser: $dto->isLikedByCurrentUser,
            date: $dto->createdAt,
            author: $author ?? null,
            media: $postMedia
        );
    }

    public function toPostListResponse(array $dtos): array
    {
        $postIds = array_map(fn(PostFeedRowDTO $post) => $post->id, $dtos);

        $authorIds = array_values(array_unique(array_map(fn(PostFeedRowDTO $row) => $row->authorId, $dtos)));

        $media = $this->mediaAssetDirectory->getBindingsByPostIds($postIds);

        $authorsPreviews = $this->userDirectory->findPreviewsByIds($authorIds);

        $authorById = [];
        foreach ($authorsPreviews as $authorPreview) {
            $authorById[$authorPreview->id] = $authorPreview;
        }

        $posts = [];

        foreach ($dtos as $post) {
            $postMedia = $media[$post->id->toRfc4122()] ?? [];
            $author = $authorById[$post->authorId->toRfc4122()] ?? null;
            $posts[] = $this->toPostResponse(
                dto: $post,
                author: $author,
                postMedia: $postMedia
            );
        }

        return $posts;
    }
}
