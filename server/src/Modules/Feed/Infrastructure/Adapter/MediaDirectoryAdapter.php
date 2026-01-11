<?php

namespace App\Modules\Feed\Infrastructure\Adapter;

use App\Modules\Feed\Application\Port\MediaAssetDirectoryInterface;
use App\Modules\Media\Api\PostMediaApiInterface;
use Symfony\Component\Uid\Uuid;

class MediaDirectoryAdapter implements MediaAssetDirectoryInterface
{
    public function __construct(
        private readonly PostMediaApiInterface $postMediaApi,
    ) {}
    public function addMediaToPost(array $mediaIds, Uuid $postId): void
    {
        $this->postMediaApi->addMediaToPost($mediaIds, $postId);
    }

    public function getBindingsByPostIds(Uuid $currentUser, array $postIds): array
    {
        return $this->postMediaApi->getMediasForPosts($currentUser, $postIds);
    }
}
