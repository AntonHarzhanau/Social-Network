<?php

namespace App\Modules\Feed\Application\Service;

use App\Modules\Feed\Application\Port\MediaAssetDirectoryInterface;
use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\Feed\Domain\Entity\PostMediaBinding;
use App\Modules\Feed\Domain\Repository\PostMediaBindingRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class PostMediaBindingsService
{
    public function __construct(
        private readonly PostMediaBindingRepositoryInterface $postMediaBindingRepository,
        private readonly MediaAssetDirectoryInterface $mediaAssetDirectory,
    ) {}

    public function addMediaToPost(array $mediaIds, Post $post): void
    {
        $media = $this->mediaAssetDirectory->getMediaAssetsByIds($mediaIds);
        foreach ($media as $mediaItem) {
            $binding = (new PostMediaBinding())
                ->setPost($post)
                ->setMedia($mediaItem);
            $this->postMediaBindingRepository->save($binding, false);
        }
    }

    public function removeMediaFromPost(array $mediaIds, Uuid $post): void {}

    public function getMediasForPosts(array $postIds): array
    {
        $bindings = $this->postMediaBindingRepository->findBindingRowsByPostIds($postIds);

        $byPost = array_fill_keys($postIds, []);

        if ($bindings === []) {
            return $byPost;
        }

        $mediaIds = [];
        foreach ($bindings as $row) {
            $mediaIds[] = $row['mediaId'];
        }
        $mediaIds = array_values(array_unique($mediaIds));

        /** @var array<string, MediaItemDTO> $mediaById */
        $mediaById = $this->mediaAssetDirectory->getMediaItems($mediaIds);

        foreach ($bindings as $row) {
            $postId = $row['postId'];
            $mediaId = $row['mediaId'];

            if (!isset($mediaById[$mediaId])) {
                continue;
            }

            $byPost[$postId][] = $mediaById[$mediaId];
        }
        return $byPost;
    }
}
