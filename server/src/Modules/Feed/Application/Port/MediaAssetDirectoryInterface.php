<?php

namespace App\Modules\Feed\Application\Port;

use Symfony\Component\Uid\Uuid;

interface MediaAssetDirectoryInterface
{
    public function addMediaToPost(array $mediaIds, Uuid $postId): void;

    public function getBindingsByPostIds(Uuid $currentUser, array $postIds): array;
}
