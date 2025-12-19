<?php

namespace App\Modules\Media\Api;

use Symfony\Component\Uid\Uuid;

interface PostMediaApiInterface
{
    public function addMediaToPost(array $mediaIds, Uuid $post): void;

    public function removeMediaFromPost(array $mediaIds, Uuid $post): void;

    public function getMediasForPosts(array $postIds): array;
}
