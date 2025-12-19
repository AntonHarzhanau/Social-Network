<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\DTO\PostFeedItem;
use App\Modules\Feed\Application\Port\MediaAssetDirectoryInterface;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\User\Domain\Entity\User;

final class GetPostByIdAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
        private readonly MediaAssetDirectoryInterface $mediaAssetDirectory,
    ) {}

    public function __invoke(string $postId, User $currentUser): ?PostFeedItem
    {
        $rows = $this->postRepository->findPosts(currentUser: $currentUser, id: $postId);
        if (count($rows) === 0) {
            return null;
        }
        $post = $rows[0];
        $media = $this->mediaAssetDirectory->getBindingsByPostIds([$post->id]);
        $post->media = $media[$post->id] ?? [];

        return $post;
    }
}
